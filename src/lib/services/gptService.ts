import { OPENAI_KEY } from "$env/static/private";
import OpenAI from "openai";

// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const chatModel = "gpt-3.5-turbo";
const imageModel = "dall-e-3";

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