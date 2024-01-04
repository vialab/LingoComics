import { OPENAI_KEY } from "$env/static/private";
import { OpenAI } from 'openai';
import { generateMomentPrompt, generateScenarioPrompt, generateSituationsPrompt } from './prompts.js';


// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const model = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();
    const { title, setting, situation, tone, conflict } = body;

    console.log(title, setting, situation, tone, conflict);

    return new Response(JSON.stringify({ "data": "retrieving info from gpt" }), { status: 200 });
}

async function gptPrompt(openai: OpenAI, model: string, prompt: string) : Promise<OpenAI.Chat.Completions.ChatCompletion> {
    return await openai.chat.completions.create({
        model: model,
        messages: [{
            'role': 'user',
            'content': prompt
        }]
    });
}

function parseSituation(segments: string[]) {
    const result = segments.map(segment => {
        const trimmedTitle = segment.trim();

        if (trimmedTitle) {
            return { title: trimmedTitle };
        }
    }).filter(Boolean);

    return result;
}