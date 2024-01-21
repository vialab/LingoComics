import { generateImage } from '$lib/services/gptService.js';
import { generateScenarioImagePrompt } from '../../prompts.js';

export const POST = async ({ request }) => {
    const body = await request.json();
    const { scenario } = body;

    try {
        // generate scenario image
        const scenarioPrompt = generateScenarioImagePrompt(scenario);
        const scenarioImage  = await generateImage(scenarioPrompt);
        
        return new Response(JSON.stringify({ "data": scenarioImage }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }

}