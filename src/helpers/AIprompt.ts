

export const AI_PROMPT = (
  destination: string,
  timeframe: string,
  travelers: string | null,
  preferences: string,
  budget: "budget" | "moderate" | "luxury"
): string => {
  return `
You are a specialized travel API that ONLY outputs valid JSON data in the exact format requested.

Task: Generate a detailed travel itinerary for the following parameters:
- Location: ${destination}
- Timeframe: ${timeframe}
- Travelers: ${travelers}
- Preferences: ${preferences}
- Budget: ${budget}
Requirements:
1. The JSON must include all fields from the schema - if data isn't applicable, use null values.
2. The itinerary must include activities for all the days in the timeframe following {
  "itinerary": [
    {
      "day": 1,
      "theme": "...",
      "best_time_to_visit": "...",
      "activities": [...]
    },
    // ... day 2, day 3, etc. ...
  ]
}.
2. Each day must include breakfast, lunch, and dinner with specific time slots .
3. Ensure all the activities suggested are in the location specified.
4. Ensure the activities are suitable for the travelers and preferences.
5. Include at least 3 activities for each day unless specified otherwise in the user preference.
5. Include at least 3 hotel suggestions.
6. Each activity must have a specific time slot (e.g., "9:00 AM - 11:00 AM") and ensure they are open at the suggested time slot.
7. Ensure all strings are properly escaped and the JSON is complete.
8. DO NOT truncate or abbreviate any content.

Important: I will be directly parsing your response as JSON. Any text before or after the JSON, or any syntax errors, will cause a failure. Return ONLY valid, complete JSON data.
`;
};




export const UPDATE_PROMPT = (trip: any, changeRequest: string) => {
  return `
You are a specialized travel API that ONLY outputs valid JSON data.

Task: Modify the existing travel itinerary below based on the user's requested changes.

Existing itinerary:
${JSON.stringify(trip.generatedItinerary, null, 2)}

User's requested changes:
${changeRequest}

Requirements:
1. Your output MUST ONLY be valid JSON. No text before or after the JSON object.
2. You must maintain the exact same structure as the original itinerary.
3. Only modify the parts specified in the user's change request.
4. Keep all other details exactly the same.
5. Ensure all strings are properly escaped and the JSON is complete.
6. DO NOT truncate or abbreviate any content.

Important: I will be directly parsing your response as JSON. Any text before or after the JSON, or any syntax errors, will cause a failure. Return ONLY valid, complete JSON data that matches the EXACT structure of the original.
`;
};

export const schema=
{
  "type": "object",
  "properties": {
    "generatedItinerary": {
      "type": "object",
      "properties": {
        "trip_name": { "type": "string" },
        "destination": { "type": "string" },
        "duration": { "type": "string" },
        "travelers": { "type": "string" },
        "cover_image_url": { "type": "string", "nullable": true },
        "hotels": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "hotel_name": { "type": "string" },
              "hotel_address": { "type": "string" },
              "price": { "type": "string" },
              "rating": { "type": "number" },
              "description": { "type": "string" },
              "hotel_image_url": { "type": "string", "nullable": true }
            },
            "required": ["hotel_name", "hotel_address", "price", "rating", "description"]
          }
        },
        "itinerary": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "day": { "type": "integer" },
              "theme": { "type": "string" },
              "best_time_to_visit": { "type": "string" },
              "activities": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "place_name": { "type": "string" },
                    "place_address": { "type": "string" },
                    "place_details": { "type": "string" },
                    "ticket_pricing": { "type": "string" },
                    "rating": { "type": "number" },
                    "travel_time": { "type": "string" },
                    "place_image_url": { "type": "string", "nullable": true },
                    "time_slot": { "type": "string" }
                  },
                  "required": ["place_name", "place_details", "ticket_pricing", "rating", "travel_time", "time_slot"]
                }
              }
            },
            "required": ["day", "theme", "best_time_to_visit", "activities"]
          }
        }
      },
      "required": ["trip_name", "destination", "duration", "travelers", "hotels", "itinerary"]
    },
    "tripDetails": {
      "type": "object",
      "properties": {
        "budget": { "type": "string" },
        "location": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "full_destination_name": { "type": "string" }
          },
          "required": ["description", "full_destination_name"]
        },
        "timeframe": { "type": "string" },
        "preferences": { "type": "string" },
        "narrative": { "type": "string" },
        "transportation": {
          "type": "object",
          "properties": {
            "airport": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "code": { "type": "string" },
                "description": { "type": "string" }
              },
              "required": ["name", "code", "description"]
            },
            "local_transport": { "type": "array", "items": { "type": "string" } },
            "transportation_tips": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "tip": { "type": "string" },
                  "details": { "type": "string" }
                },
                "required": ["tip", "details"]
              }
            }
          },
          "required": ["airport", "local_transport", "transportation_tips"]
        }
      },
      "required": ["budget", "location", "timeframe", "preferences", "narrative", "transportation"]
    }
  },
  "required": ["generatedItinerary", "tripDetails"]
}