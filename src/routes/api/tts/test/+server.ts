import type { RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import OpenAI from "openai";
import { writeFile } from 'fs/promises';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const POST : RequestHandler = async ({ request }) => {
    const body = await request.json();

    const text: string = body.text;
    const fileName: string = body.fileName;

    try {
        const response = await openai.audio.speech.create({
            model: 'tts-1-hd',
            voice: 'alloy',
            input: text
        });

        const audioData = Buffer.from(await response.arrayBuffer());

        const filepath = `${fileName}.mp3`;

        await writeFile(filepath, audioData);



        return new Response(JSON.stringify({ "data" : "success" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error getting tts" }), { status: 500 });
    }
}