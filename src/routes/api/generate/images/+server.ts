import { GOOGLE_API_KEY, OPENAI_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { generateScenarioImagePrompt, generateSituationImagePrompt } from '../../prompts.js';
import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';

// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const model = "dall-e-3";

// initialize bucket
const storage = new Storage({ keyFilename: GOOGLE_API_KEY });
const bucketName = 'lingoimages';
const fileName = 'temp-file.jpg';

type Moment = {
    moment1: string,
    moment2: string,
    moment3: string,
    moment4: string
}

export const POST = async ({ request }) => {
    const body = await request.json();
    const { scenario, situations } = body;

    try {
        // generate scenario image
        const scenarioPrompt = generateScenarioImagePrompt(scenario);
        const scenarioImage  = await generateImage(scenarioPrompt);

        // generate situation image
        const situationImages = [];
        for (const situation of situations) {
            const { moment1, moment2, moment3, moment4 }: Moment = situation.moments;
            const situationPrompt = generateSituationImagePrompt(situation.title, scenario, moment1.concat(moment2, moment3, moment4));
            const situationImage = await generateImage(situationPrompt);
            situationImages.push(situationImage);
        }
        
        // Send the base64 string as a response
        return new Response(JSON.stringify({ "data": scenarioImage, situationImages }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }
};

// upload to google storgae bucket
async function uploadImage(imageBuffer: string) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        await file.save(imageBuffer, {
            metadata: { contentType: 'image/jpeg' }
        });

        await file.makePublic();
        console.log(`${fileName} uploaded to ${bucketName}`);
    } catch (error) {
        console.error(error);
    }
}

async function generateImage(prompt: string) {
    try {
        const response = await openai.images.generate({
            prompt: prompt,
            model: model,
            n: 1,
            size: '1024x1024'
        });

        // fetch image from URL
        const imageUrl = response.data[0].url;
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