"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = void 0;
const speech_1 = require("@google-cloud/speech");
const client = new speech_1.SpeechClient();
const transcribeAudio = async (req, res) => {
    try {
        const { audio, mimeType, totalChunks, currentChunk } = req.body;
        // Validate input
        if (!audio) {
            res.status(400).json({ error: 'No audio data provided' });
            return;
        }
        // Optional: Implement chunk tracking if needed
        console.log(`Processing chunk ${currentChunk + 1} of ${totalChunks}`);
        const audioBuffer = Buffer.from(audio, 'base64');
        const [response] = await client.recognize({
            audio: {
                content: audioBuffer
            },
            config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
                enableAutomaticPunctuation: true,
                audioChannelCount: 2,
                model: 'default', // You can specify different models if needed
                profanityFilter: false,
            }
        });
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join(' ');
        res.json({
            transcription,
            chunk: currentChunk,
            totalChunks
        });
    }
    catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({
            error: 'Transcription failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.transcribeAudio = transcribeAudio;
