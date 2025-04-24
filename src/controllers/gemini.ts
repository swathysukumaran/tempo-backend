import express from 'express';
import { AI_PROMPT, UPDATE_PROMPT ,schema} from '../helpers/AIprompt';
import { get } from 'lodash';
import { createNewTrip, getTripById, updateTripItinerary } from '../db/trip';
import { getUserById } from '../db/users';


const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.GEMINI_API_KEY;

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
const MAX_RETRIES = 3;


// Function to generate content with retries

async function generateWithRetry(prompt: string) {
  let attempts = 0;
  let lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      // Add a retry-specific instruction if this is a retry attempt
      const modifiedPrompt = attempts > 0 
        ? `${prompt}\n\nIMPORTANT: Previous attempts failed with error: "${lastError}". Please ensure your response is COMPLETE, VALID JSON with no truncation, no text before or after, and all strings properly escaped.` 
        : prompt;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: modifiedPrompt }] }],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more deterministic responses
          maxOutputTokens: 8192,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json",
          responseSchema:schema 
        },
      });   
      console.log('API call successful:', result.response);
      return result.response;
    } catch (apiError) {
      lastError = apiError.message;
      console.warn(`API call attempt ${attempts + 1} failed: ${apiError.message}`);
      attempts++;
      
      // Wait a bit longer between retries (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
}

export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location,timeframe,  travelers,
    preferences,budget} = req.body;
        const userId = get(req, 'identity._id');
        
        const FINAL_PROMPT = AI_PROMPT(
    location.label,
    timeframe,
    travelers,
    preferences,
    budget,
    
  );

                 // Safety check for prompt size
    if (FINAL_PROMPT.length > 30000) {
       res.status(400).json({ error: 'Prompt exceeds maximum allowed length' });
       return;
    }

       
            
            
            const response = await generateWithRetry(FINAL_PROMPT);
    const text = response.text();
    // Extract the JSON content from the response if there's any text before or after

    const itinerary=extractJSON(text);
    console.log('Itinerary:',itinerary);
    const narrative=itinerary.tripDetails.narrative;
            const generatedItinerary=itinerary.generatedItinerary;
            const trip=await createNewTrip(userId,{location,timeframe,narrative, travelers,
    preferences,budget},generatedItinerary);
            res.status(200).json({
                tripId: trip._id,
            });
            return;
           

    }catch(error){
        console.error('Error generating itinerary:',error);
        res.sendStatus(500).json({
            error: 'Failed to generate itinerary',
            details:error.message
        });
        return;
    }

}

function extractJSON(text:string){
    console.log('Extracting JSON from response',text);
    try{
    // Attempt 1: Try to parse the entire text as JSON
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.log("Direct JSON parse failed, trying to extract JSON..",parseError);
    }
    // Second attempt: Try to extract JSON between backticks or braces
    const jsonRegex = /```json\s*(\{[\s\S]*\})\s*```|(\{[\s\S]*\})/;
    const match = text.match(jsonRegex);
    
    if (match) {
      const jsonStr = (match[1] || match[2]).trim();
      return JSON.parse(jsonStr);
    }
    // Third attempt: Fix common JSON errors and try again
    const fixedText = attemptToFixJSON(text);
    return JSON.parse(fixedText);
  } catch (error) {
    console.error('Error extracting JSON:', error);
    throw new Error(`Invalid or incomplete JSON response: ${error.message}`);
  }
}

// Function to attempt to fix common JSON errors

function attemptToFixJSON(text:string){
    // Try to identify and extract just the json portion
    let jsonCandidate=text;
    // Remove any text before the first '{'

    const startPos=jsonCandidate.indexOf('{');
    if(startPos !==-1){
        jsonCandidate=jsonCandidate.substring(startPos);
    }
    // Remove any text after the last '}'
    const endPos = jsonCandidate.lastIndexOf('}');
    if(endPos !==-1){
        jsonCandidate=jsonCandidate.substring(0,endPos+1);
    }

    // Fix common JSON syntax errors
    jsonCandidate=jsonCandidate
    // Fix unescaped quotes in strings
    .replace(/(?<=":.*[^\\])"(?=.*[,}])/g, '\\"')
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
    // Fix trailing commas in objects and arrays
    .replace(/,(\s*[}\]])/g, '$1');
  
  return jsonCandidate;
}
// Update an existing Itinerary
export const updateItinerary=async (req:express.Request,res:express.Response)=>{
    try{
        const { tripId } = req.params;
        const { changeRequest } = req.body;
        const userId = get(req, 'identity._id');
        if(!changeRequest){
            res.status(400).json({
                error:'Missing trip or change request data'
            });
            return;
        }
         const trip = await getTripById( tripId);
    
        if (!trip) {
         res.status(404).json({ error: "Trip not found" });
         return;
        }

        const currentUser=await getUserById(userId);
        console.log('Current User:',currentUser);
        console.log("Trip owner ID:", trip.userId.toString());
        console.log("Shared editors:", trip.sharedWith);
        const isOwner = trip.userId.toString() === ((userId ?? '').toString());
        const isSharedEditor=trip.sharedWith?.some((entry)=>entry.email===currentUser.email&& entry.permission === 'edit');
         if (!isOwner && !isSharedEditor) {
            console.log('User does not have permission to modify this trip');
            res.status(403).json({ error: "You don't have permission to modify this trip" });
            return;
          }
        const prompt=UPDATE_PROMPT(trip,changeRequest);
        console.log('Prompt:',prompt);
        if(prompt.length>30000){
            res.status(400).json({error:'Prompt exceeds maximum allowed length'});
            return;
        }
        const response = await generateWithRetry(prompt);
        const text = response.text();
    
    // Extract and validate JSON from the response
    const updatedItinerary = extractJSON(text);
    console.log('Updated Itinerary:',updatedItinerary);
    const newTrip=await updateTripItinerary(userId,tripId,updatedItinerary);
            res.status(200).json(newTrip);
            return;
    }catch(error){
        console.error('Error updating itinerary:',error);
        res.status(500).json({
            error:'Failed to update itinerary',
            details:error.message
        });
    }
};
