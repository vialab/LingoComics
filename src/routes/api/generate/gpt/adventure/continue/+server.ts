import { generateImage, gptPrompt } from '$lib/services/gptService.js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { generateContinueNarrativePrompt, generateNewImagePrompt, generateNextStepPrompt, generateOptions, getKeywordPrompts } from '../../../../prompts.js';
import { env } from '$env/dynamic/private';
import type { StoryStruct } from '../../../../../../utils/types.js';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();

    const scenario : StoryStruct = body.scenario;
    // const scene : Scene = body.scene;
    const previousNarrative = body.narrative;
    const selectedOption = body.selectedOption;
    
    try {
        // generate new narrative
        const narrativePrompt = generateContinueNarrativePrompt(previousNarrative, selectedOption);
        const completion = (await gptPrompt(openai, chatModel, narrativePrompt)).choices[0].message.content?.trim() as string;

        // generate new next step
        const nextStepPrompt = generateNextStepPrompt(completion);
        const nextStep = (await gptPrompt(openai, chatModel, nextStepPrompt)).choices[0].message.content?.trim() as string;
        
        // generate new options
        const optionsPrompt = generateOptions(`${completion}. ${nextStep}.`);
        const options = (await gptPrompt(openai, chatModel, optionsPrompt)).choices[0].message.content?.trim().split('\n').filter(op => op.trim() !== '');

        // generate new scene image
        const newSceneDescription = generateNewImagePrompt(scenario.character, scenario.setting, scenario.scenario, completion, selectedOption);
        const newScene = await generateImage(newSceneDescription);

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

        const phaseContinue = { sceneId: uuidv4(), narrative: completion, nextStep: nextStep, image: newScene, moment: optionKeywordsArray };

        return new Response(JSON.stringify({ "data": phaseContinue }), { status: 200 });
    } catch (error) {
        console.error("Error generating next step of adventure:", error);
        return new Response(JSON.stringify({ "data": "Error generating next step of adventure:" }), { status: 500 });
    }
}