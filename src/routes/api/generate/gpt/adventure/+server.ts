import { gptPrompt } from '$lib/services/gptService.js';
import OpenAI from 'openai';
import type { StoryStruct } from '../../../../../utils/types.js';
import { env } from '$env/dynamic/private';
import { generateNarrativePrompt, generateNextStepPrompt, generateOptions, getKeywordPrompts } from '../../../prompts.js';
import { text } from '@sveltejs/kit';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();

    let scenario : StoryStruct = body;

    let moment : string = scenario.situations[0].moments[0].momentSummarization;
    
    try {
        // narrative
        const narrativePrompt = generateNarrativePrompt(moment);
        const completion = (await gptPrompt(openai, chatModel, narrativePrompt)).choices[0].message.content?.trim() as string;

        // next step prompt
        const nextStepPrompt = generateNextStepPrompt(completion);
        const nextStep = (await gptPrompt(openai, chatModel, nextStepPrompt)).choices[0].message.content?.trim() as string;

        // generate options
        const optionsPrompt = generateOptions(`${moment}. ${completion}. ${nextStep}`);
        const options = (await gptPrompt(openai, chatModel, optionsPrompt)).choices[0].message.content?.trim().split('\n').filter(op => op.trim() !== '');

        if (options) {
            for (let option of options) {
                const keywordPrompt = getKeywordPrompts(option);
                const keywords = (await gptPrompt(openai, chatModel, keywordPrompt)).choices[0].message.content?.trim().split('\n').filter(op => op.trim() !== '');

                console.log(keywords);
            }
        }

        // return obj
        const phaseOne = { narrative: completion, nextStep: nextStep, options };

        return new Response(JSON.stringify({ "data": phaseOne }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
}