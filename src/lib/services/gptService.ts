import { v4 as uuidv4 } from 'uuid';
// import { OPENAI_KEY, GOOGLE_API_KEY } from "$env/dynamic/private";
import { env } from '$env/dynamic/private';
import { Storage } from '@google-cloud/storage';
import OpenAI from "openai";
import { generateCharacterAttributes } from "./characterGenerator";
import { generateCharacterPrompt, generateMomentDescriptionPrompt, generateMomentPrompt, generateScenarioPrompt, generateSituationPrompt, getCharacterPrompt, getKeywordPrompts, getScenarioTitlePrompt, getStorySetting, summarizeMoment, summarizeStoryPrompt } from "../../routes/api/prompts";
import { updateMomentDescriptionContextPrompt, updateMomentImageContextPrompt, updateStoryContextPrompt } from '../../routes/api/generate/update/update-prompts';

// initialize bucket
const storage = new Storage({ keyFilename: env.GOOGLE_API_KEY });
const bucketName = 'lingoimages';

// initialize openai
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const chatModel = 'gpt-4-0125-preview'; //'gpt-3.5-turbo';
const chatModel2 = 'gpt-3.5-turbo';
const imageModel = "dall-e-3";

type Situation = {
    id?: string,
    title: string,
    situationSort?: number,
    moments: Moment[]
};

type Moment = {
    momentImageDescriptionResponse: string,
    momentImageDescription: string,
    momentDescription: string,
    momentSummarization: string
}


export async function gptPrompt(openai: OpenAI, model: string, prompt: string, max_tokens?: number) : Promise<OpenAI.Chat.Completions.ChatCompletion> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completionsParams: any = {
        model: model,
        messages: [{
            'role': 'user',
            'content': prompt
        }]
    };

    if (max_tokens !== undefined) {
        completionsParams.max_tokens = max_tokens;
    }

    return await openai.chat.completions.create(completionsParams);
}

export async function generateImage(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: imageModel,
            n: 1,
            size: '1024x1024',
        });

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

        const imageBase64String = `data:image/png;base64,${base64data}`;

        // upload image and send file to frontend?
        const imageFile = await uploadImage(imageBase64String, uuidv4());
        
        // send base64 string as a response
        return `https://storage.googleapis.com/lingoimages/${imageFile?.name}`;
        // return response.data[0].url;
    } catch (error) {
        console.error(error);
    }
}


export async function generateImageNoSave(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: imageModel,
            n: 1,
            size: '1024x1024',
        });

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

        const imageBase64String = `data:image/png;base64,${base64data}`;
        
        // send base64 string as a response
        return imageBase64String;
        // return response.data[0].url;
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
 * Function to get the title of the overall story
 * @param story 
 * @returns 
 */
export async function getScenarioTitle(story: string) : Promise<string> {
    console.log("Getting scenario title...");
    const scenarioTitlePrompt : string = getScenarioTitlePrompt(story);
    const scenario : string = (await gptPrompt(openai, chatModel, scenarioTitlePrompt)).choices[0].message.content?.trim() as string;
    return scenario;
}

/**
 * Function to get the character of the story
 * @param story 
 * @returns 
 */
export async function getCharacterFromScenario(story: string) : Promise<string> {
    console.log("Extracting character from story...");
    const characterPrompt : string = getCharacterPrompt(story);
    const character : string = (await gptPrompt(openai, chatModel, characterPrompt)).choices[0].message.content?.trim() as string;
    return character;
}

/**
 * Function that will summarize the story
 * @param story 
 * @returns 
 */
export async function summarizeStory(story: string) : Promise<string> {
    console.log("Summarizing story...");
    const summaryPrompt : string = summarizeStoryPrompt(story); 
    const summary : string = (await gptPrompt(openai, chatModel, summaryPrompt)).choices[0].message.content?.trim() as string;
    return summary;
}

/**
 * Function that will provide a description of the setting of a given story
 * @param storySummary 
 * @returns description of story setting
 */
export async function summarizeSetting(storySummary: string) : Promise<string> {
    console.log("Summarizing setting");
    const settingPrompt : string = getStorySetting(storySummary);
    const setting : string = (await gptPrompt(openai, chatModel, settingPrompt)).choices[0].message.content?.trim() as string;
    return setting;
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
    console.log("Generating story...");
    const scenarioPrompt : string = generateScenarioPrompt(title, setting, tone, conflict);
    const scenario = (await gptPrompt(openai, chatModel, scenarioPrompt)).choices[0].message.content?.trim() as string;
    return scenario;
}

/**
 * Updates story with the 'updatedContext' for the 'updateType'
 * @param story 
 * @param updatedContent 
 * @param updateType 
 * @returns 
 */
export async function updateScenario(story : string, updatedContent : string, updateType : string) {
    const storyUpdatePrompt : string = updateStoryContextPrompt(story, updatedContent, updateType);
    const scenario = (await gptPrompt(openai, chatModel2, storyUpdatePrompt)).choices[0].message.content?.trim() as string;
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
    console.log("Generating situations...");
    const totalSituations = Number(situation);
    let previousSituationTitle = "";
    const situations = [];

    for (let currentSituation = 1; currentSituation <= totalSituations; currentSituation++) {
        const situationPrompt = generateSituationPrompt(scenario, tone, conflict, currentSituation, totalSituations, previousSituationTitle);
        const situationResponse = (await gptPrompt(openai, chatModel, situationPrompt)).choices[0].message.content?.trim() as string;
        const situationTitle = situationResponse?.split('Title: ')[1].trim();

        situations.push({ id: uuidv4(), title: situationTitle, situationSort: currentSituation });

        previousSituationTitle = situationTitle;
    }

    return situations;
}


/**
 * Update moments with updated content
 * @param story 
 * @param situations 
 * @param updatedContent 
 * @param updateType 
 * @returns 
 */
export async function updateMoments(story: string, situations: Situation[], updatedContent: string, updateType: string) {
    for (const situation of situations) {
        for (const moment of situation.moments) {
            // update moment description
            const momentDescriptionPrompt = updateMomentDescriptionContextPrompt(story, moment.momentDescription, updatedContent, updateType);
            const updatedMomentDescription = (await gptPrompt(openai, chatModel2, momentDescriptionPrompt)).choices[0].message.content?.trim() as string;

            // update moment image description
            const momentImageUpdatePrompt = updateMomentImageContextPrompt(story, moment.momentImageDescription, updatedContent, updateType);
            const updatedMomentImageDescription = (await gptPrompt(openai, chatModel2, momentImageUpdatePrompt)).choices[0].message.content?.trim() as string;
            
            // update moment summarization
            const momentSummarizationPrompt = summarizeMoment(updatedMomentDescription);
            const updatedMomentSummarization = (await gptPrompt(openai, chatModel2, momentSummarizationPrompt)).choices[0].message.content?.trim() as string;

            console.log("moment:", updatedMomentSummarization);

            // update moment image description
            moment.momentDescription = updatedMomentDescription;
            moment.momentImageDescriptionResponse = updatedMomentImageDescription;
            moment.momentSummarization = updatedMomentSummarization;
        }
    }
    return situations;
}


/**
 * Function to generate moments
 * @param situations 
 * @param scenario 
 * @param tone 
 * @param conflict 
 * @returns 
 */
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
            
            // generate image description for DALLE
            const momentImageDescriptionPrompt = generateMomentDescriptionPrompt(scenario, situation.title, momentDescription);
            const momentImageDescriptionResponse = (await gptPrompt(openai, chatModel, momentImageDescriptionPrompt, 300)).choices[0].message.content?.trim() as string;

            // generate summarized description for moment
            const momentSummarizationPrompt = summarizeMoment(momentDescription);
            const momentSummarization = (await gptPrompt(openai, chatModel, momentSummarizationPrompt)).choices[0].message.content?.trim() as string;

            const keywordPrompt = getKeywordPrompts(momentSummarization);
            const keywords = (await gptPrompt(openai, chatModel, keywordPrompt)).choices[0].message.content?.trim().split('\n').filter(op => op.trim() !== '');
            
            const keywordsObject = {};
            keywords?.map(keywordString => {
                const parts = keywordString.split(":");
                const word = parts[0].replace('- ', '').trim();
                const description = parts[1].trim();
                keywordsObject[word] = description;
            });

            // push structure with uuid for quiz
            moments.push({ momentId: uuidv4(), momentSummarization, momentDescription, momentImageDescriptionResponse, keywords: keywordsObject });
        }

        structuredSituations.push({
            ...situation,
            moments: moments
        })
    }

    return structuredSituations;
}


export async function generateMomentImageDescription(moment: string) {
    const momentImageDescriptionPrompt = generateMomentDescriptionPrompt("", "", moment);
    const momentImageDescription = (await gptPrompt(openai, chatModel, momentImageDescriptionPrompt, 300)).choices[0].message.content?.trim() as string;
    return momentImageDescription;
}


export async function uploadImage(base64String: string, fileName: string) {
    // return if no base64string
    if (base64String === undefined) {
        return null;
    }

    const strippedBase64String = base64String.split(';base64,').pop();
    if (typeof strippedBase64String !== 'string') {
        throw new Error('Invalid base64 string');
    }

    const imageBuffer = Buffer.from(strippedBase64String, 'base64');

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        await file.save(imageBuffer, {
            metadata: { contentType: 'image/png' }
        });

        await file.makePublic();

        return file;
    } catch (error) {
        console.error('error uploading image', error);   
    }
}