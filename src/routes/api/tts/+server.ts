import type { RequestHandler } from "@sveltejs/kit";
import textToSpeech from '@google-cloud/text-to-speech';
import { env } from "$env/dynamic/private";

const tts = new textToSpeech.TextToSpeechClient({
    keyFilename: env.GOOGLE_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    let text : string = body.text;

    const req = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }    
    };
    
    try {
        const [response] = await tts.synthesizeSpeech(req);
        const audioBase64 = Buffer.from(response.audioContent).toString('base64');

        let audio = "data:audio/mpeg;base64,".concat(audioBase64);

        return new Response(JSON.stringify({ audio }), { status: 200 });
    } catch (error) {
        console.error("Error saving story:", error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}