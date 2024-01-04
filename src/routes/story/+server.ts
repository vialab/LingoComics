import { OPENAI_KEY } from "$env/static/private";
import { OpenAI } from 'openai';
import { generateMomentPrompt, generateScenarioPrompt, generateSituationsPrompt } from './prompts.js';
import type { MomentObject } from "../../utils/types.js";


// initialize openai
const openai = new OpenAI({ apiKey: OPENAI_KEY });
const model = 'gpt-3.5-turbo';

export const POST = async ({ request }) => {
    const body = await request.json();
    const { title, setting, situation, tone, conflict } = body;
    
    try {
        // scenario prompt and response
        const scenarioPrompt : string = generateScenarioPrompt(title, setting, tone, conflict);
        const scenario = (await gptPrompt(openai, model, scenarioPrompt)).choices[0].message.content;

        // situation prompt and response
        const situationPrompt : string = generateSituationsPrompt(Number(situation), scenario!, tone, conflict);
        const situationResponse = (await gptPrompt(openai, model, situationPrompt)).choices[0].message.content;
        const situationParse = situationResponse?.split(/Title \d+: |Title:/);
        const situations = parseSituation(situationParse!);

        // generate moment for each situation
        const momentsPromises = situations.map(situation => {
            const momentPrompt : string = generateMomentPrompt(scenario!, situation!.title, tone, conflict);
            return gptPrompt(openai, model, momentPrompt).then(response => response.choices[0].message.content);
        });
        const moments = await Promise.all(momentsPromises);

        // create structured situation object
        const structuredSituations = situations.map((situation, index) => {
            const allMoments = moments[index]?.split('\n').filter(line => line.trim() !== '');
            const momentsObject : MomentObject = allMoments!.reduce((acc, moment, idx) => {
                // Remove the prefixes like '1. Moment:' or 'Moment 1:'
                const cleanedMoment = moment.replace(/^\d+\. Moment: |Moment \d+: /, '');
                acc[`moment${idx + 1}`] = cleanedMoment;

                return acc;
            }, {} as MomentObject);

            return {
                title: situation?.title,
                moments: momentsObject
            };
        });

        // create response data object
        const data = { scenario: scenario, situations: structuredSituations };

        return new Response(JSON.stringify(data), { status: 200});
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
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

