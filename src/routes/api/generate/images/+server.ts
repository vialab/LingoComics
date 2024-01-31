import { generateMomentImagePrompt, generateScenarioImagePrompt, generateSituationImagePrompt } from '../../prompts.js';
import { generateImage } from '$lib/services/gptService.js';

// type Moment = {
//     moment1: string,
//     moment2: string,
//     moment3: string,
//     moment4: string
// }

export const POST = async ({ request }) => {
    const body = await request.json();
    const { scenario, situations, character, setting } = body;

    try {
        // generate scenario image
        const scenarioPrompt = generateScenarioImagePrompt(scenario, character, setting);
        const scenarioImage  = await generateImage(scenarioPrompt);

        // generate situation images
        const situationImages = [];
        const momentImages = [];
        for (const situation of situations) {
            const situationPrompt = generateSituationImagePrompt(situation.title, scenario, character, setting);
            const situationImage = await generateImage(situationPrompt);
            situationImages.push(situationImage);

            // generate moment images
            for (let currentMoment = 0; currentMoment < situation.moments.length; currentMoment++) {
                console.log(situation.moments[currentMoment]);
                const momentPrompt = generateMomentImagePrompt(scenario, situation.title, situation.moments[currentMoment], character, setting);
                const momentImage = await generateImage(momentPrompt);
                momentImages.push({ title: situation.title, image: momentImage });
                situationImages.push(momentImages);
            }
        }
        
        // Send the base64 string as a response
        return new Response(JSON.stringify({ "data": scenarioImage, situationImages }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }
};