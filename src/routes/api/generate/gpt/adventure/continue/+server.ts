import { generateImageNoSave, gptPrompt } from '$lib/services/gptService.js';
import OpenAI from 'openai';
import { generateContinueNarrativePrompt, generateNarrativePrompt, generateNewImagePrompt, generateNextStepPrompt, generateOptions } from '../../../../prompts.js';
import { env } from '$env/dynamic/private';
import type { Scene, StoryStruct } from '../../../../../../utils/types.js';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();

    let scenario : StoryStruct = body.scenario;
    let scene : Scene = body.scene;
    let previousNarrative = body.narrative;
    let selectedOption = body.selectedOption;
    
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
        const newScene = await generateImageNoSave(newSceneDescription);

        const phaseContinue = { narrative: completion, nextStep: nextStep, options, image: newScene };

        return new Response(JSON.stringify({ "data": phaseContinue }), { status: 200 });
    } catch (error) {
        console.error("Error generating next step of adventure:", error);
        return new Response(JSON.stringify({ "data": "Error generating next step of adventure:" }), { status: 500 });
    }
}