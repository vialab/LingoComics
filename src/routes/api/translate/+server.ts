import type { RequestHandler } from "@sveltejs/kit";
import { translateTextPrompt } from "../prompts";
import { gptPrompt } from "$lib/services/gptService";
import OpenAI from "openai";
import { env } from "$env/dynamic/private";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    
    let text : string = body.text;
    let language : string = body.language;

    try {
        const translationPrompt = translateTextPrompt(text, language);
        const translation = (await gptPrompt(openai, chatModel, translationPrompt)).choices[0].message.content?.trim() as string;

        return new Response(JSON.stringify({ translation }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error translating text" }), { status: 500 });
    }
}