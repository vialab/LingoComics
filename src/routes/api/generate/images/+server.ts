import { GOOGLE_API_KEY, OPENAI_KEY } from '$env/static/private';
import OpenAI from 'openai';
import { generateScenarioImagePrompt } from '../../prompts.js';
import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';

// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const model = "dall-e-3";

// initialize bucket
const storage = new Storage({ keyFilename: GOOGLE_API_KEY });
const bucketName = 'lingoimages';
const fileName = 'temp-file.jpg';


export const POST = async ({ request }) => {
    const body = await request.json();
    const { scenario } = body;

    try {
        const response = await openai.images.generate({
            prompt: generateScenarioImagePrompt(scenario),
            model: model,
            n: 1,
            size: "1024x1024"
        });

        // Fetch the image from the URL
        const imageUrl = response.data[0].url;
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();

        const imageBuffer = Buffer.from(arrayBuffer);

        // Convert the buffer to a base64 string
        const base64data = imageBuffer.toString('base64');

        // TEMPORARY - TO SAVE IMAGE TO GOOGLE CLOUD STORAGE //
        uploadImage(imageBuffer);

        // Send the base64 string as a response
        return new Response(JSON.stringify({ "data": `data:image/png;base64,${base64data}` }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }
};

// upload to google storgae bucket
async function uploadImage(imageBuffer: Buffer) {
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