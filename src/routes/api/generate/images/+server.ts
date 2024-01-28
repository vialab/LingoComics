import { generateScenarioImagePrompt, generateSituationImagePrompt } from '../../prompts.js';
import { generateImage } from '$lib/services/gptService.js';

// type Moment = {
//     moment1: string,
//     moment2: string,
//     moment3: string,
//     moment4: string
// }

export const POST = async ({ request }) => {
    const body = await request.json();
    const { scenario, situations, character } = body;

    try {
        // generate scenario image
        const scenarioPrompt = generateScenarioImagePrompt(scenario, character);
        const scenarioImage  = await generateImage(scenarioPrompt);

        // generate situation image
        const situationImages = [];
        for (const situation of situations) {
            const situationPrompt = generateSituationImagePrompt(situation.title, scenario, character);
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