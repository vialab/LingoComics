import { gptPrompt } from '$lib/services/gptService.js';
import OpenAI from 'openai';
import type { StoryStruct } from '../../../../utils/types.js';
import { env } from '$env/dynamic/private';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();

    let scenario : StoryStruct = body;

    let moment : string = scenario.situations[0].moments[0].momentSummarization;

    console.log(moment);
    
    try {
        const narrativePrompt = `Generate a small length sentence for this piece of text: ${moment}. Make the tone of sentence be in a narrative perspective so as to set up a scene for the same story in the sentence.`;
        const completion = (await gptPrompt(openai, chatModel, narrativePrompt)).choices[0].message.content?.trim() as string;

        return new Response(JSON.stringify({ "data": completion }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
}