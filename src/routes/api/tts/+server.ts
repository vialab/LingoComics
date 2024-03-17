import type { RequestHandler } from "@sveltejs/kit";
import textToSpeech from '@google-cloud/text-to-speech';
import { env } from "$env/dynamic/private";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    let text : string = body.text;
    
    try {
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice:"alloy",
            input: text
        });

        let audioArrayBuffer = await response.arrayBuffer();
        let audioBase64 = Buffer.from(audioArrayBuffer).toString('base64');

        let audio = "data:audio/mpeg;base64,".concat(audioBase64);

        return new Response(JSON.stringify({ audio }), { status: 200 });
    } catch (error) {
        console.error("Error saving story:", error);
        return new Response(JSON.stringify({ "data": "error getting tts" }), { status: 500 });
    }
}