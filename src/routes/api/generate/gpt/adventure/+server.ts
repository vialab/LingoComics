import { gptPrompt } from '$lib/services/gptService.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import type { StoryStruct } from '../../../../../utils/types.js';
import { env } from '$env/dynamic/private';
import { generateNarrativePrompt, generateNextStepPrompt, generateOptions, getKeywordPrompts } from '../../../prompts.js';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();

    const scenario : StoryStruct = body;

    const moment : string = scenario.situations[0].moments[0].momentSummarization;
    
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

        const optionKeywordsArray = [];
        if (options) {
            for (const option of options) {
                const keywordPrompt = getKeywordPrompts(option);
                const keywords = (await gptPrompt(openai, chatModel, keywordPrompt)).choices[0].message.content?.trim().split('\n').filter(op => op.trim() !== '');

                let keywordsObject = {};
                const keywordsObjects = keywords?.map(keywordString => {
                    const parts = keywordString.split(':');
                    const word = parts[0].replace('- ', '').trim();
                    const description = parts[1].trim();
                    return { [word]: description };
                })

                keywordsObjects?.forEach(keyword => {
                    keywordsObject = {...keywordsObject, ...keyword };
                });

                optionKeywordsArray.push({
                    momentId: uuidv4(),
                    momentSummarization: option,
                    keywords: keywordsObject
                });
            }
        }

        // return obj
        const phaseOne = { sceneId: uuidv4(), narrative: completion, nextStep: nextStep, moment: optionKeywordsArray };

        return new Response(JSON.stringify({ "data": phaseOne }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
}