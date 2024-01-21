import { OPENAI_KEY } from "$env/static/private";
import OpenAI from "openai";
import { generateCharacterAttributes } from "./characterGenerator";
import { generateCharacterPrompt, generateMomentPrompt, generateScenarioPrompt, generateSituationPrompt } from "../../routes/api/prompts";

// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const chatModel = 'gpt-3.5-turbo';
const imageModel = "dall-e-3";

type Situation = {
    title: string
}

export async function gptPrompt(openai: OpenAI, model: string, prompt: string) : Promise<OpenAI.Chat.Completions.ChatCompletion> {
    return await openai.chat.completions.create({
        model: model,
        messages: [{
            'role': 'user',
            'content': prompt
        }]
    });
}

export async function generateImage(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: imageModel,
            n: 1,
            size: '1024x1024'
        });

        console.log('image response:', response);

        // fetch image from URL
        const imageUrl = response.data[0].url;
        if (typeof imageUrl !== 'string') {
            throw new Error('Invalid URL');
        }
        
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();

        const imageBuffer = Buffer.from(arrayBuffer);

        // convert the buffer to a base64 string
        const base64data = imageBuffer.toString('base64');

        // send base64 string as a response
        return `data:image/png;base64,${base64data}`;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Function to generate a detailed character description based on randomly generated attributes
 * @returns character description
 */
export async function generateCharacterDescription() : Promise<string> {
    const characterAttr : string = generateCharacterAttributes();
    const characterDescription : string = generateCharacterPrompt(characterAttr);
    const character : string = (await gptPrompt(openai, chatModel, characterDescription)).choices[0].message.content?.trim() as string;
    return character;
}

/**
 * Function to generate scenario based on paramter inputs
 * @param title title or premise of story
 * @param setting setting of story
 * @param tone tone of story
 * @param conflict conflict within story
 * @returns scenario title
 */
export async function generateScenario(title : string, setting : string, tone : string, conflict : string) : Promise<string> {
    const scenarioPrompt : string = generateScenarioPrompt(title, setting, tone, conflict);
    const scenario = (await gptPrompt(openai, chatModel, scenarioPrompt)).choices[0].message.content?.trim() as string;
    return scenario;
}


/**
 * Function to generate situation titles for given scenario
 * @param scenario 
 * @param situation 
 * @param tone 
 * @param conflict 
 * @returns 
 */
export async function generateSituations(scenario: string ,situation: string, tone: string, conflict: string) {
    const totalSituations = Number(situation);
    let previousSituationTitle = "";
    const situations = [];

    for (let currentSituation = 1; currentSituation <= totalSituations; currentSituation++) {
        const situationPrompt = generateSituationPrompt(scenario, tone, conflict, currentSituation, totalSituations, previousSituationTitle);
        const situationResponse = (await gptPrompt(openai, chatModel, situationPrompt)).choices[0].message.content?.trim() as string;
        const situationTitle = situationResponse?.split('Title: ')[1].trim();

        situations.push({ title: situationTitle });

        previousSituationTitle = situationTitle;
    }

    return situations;
}


export async function generateMoments(situations : Situation[], scenario: string, tone: string, conflict: string) {
    const totalSituations = situations.length;
    const structuredSituations = [];

    for (let situationIndex = 0; situationIndex < totalSituations; situationIndex++) {
        const situation = situations[situationIndex];
        const totalMoments = 4;
        const moments = [];

        console.log(`generating moment for situation: ${situation.title}`);

        for (let momentIndex = 1; momentIndex <= totalMoments; momentIndex++) {
            const momentPrompt = generateMomentPrompt(situation.title, scenario, tone, conflict, momentIndex, totalMoments, situationIndex + 1, totalSituations, situations[situationIndex - 1]?.title, situations[situationIndex + 1]?.title)
            const momentResponse = (await gptPrompt(openai, chatModel, momentPrompt)).choices[0].message.content?.trim() as string;
            const momentDescription = momentResponse?.replace(/^\d+\. Moment: |Moment \d+: /, '');
            moments.push(momentDescription);
        }

        structuredSituations.push({
            ...situation,
            moments: moments
        })
    }

    return structuredSituations;
}