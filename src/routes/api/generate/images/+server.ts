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

            // console.log(situation.moments);

            // convert moment objects into array of moment objects
            const momentsArray = Object.values(situation.moments);

            // generate moment images
            for (const moment of momentsArray) {
                // console.log(`Generating moment: ${moment}`);
                const momentPrompt = generateMomentImagePrompt(scenario, situation.title, moment.momentImageDescriptionResponse, character, setting);
                const momentImage = await generateImage(momentPrompt);
                momentImages.push({ title: situation.title, image: momentImage, moment: moment.momentDescription });
            }

            // for (let currentMoment = 0; currentMoment < situation.moments.length; currentMoment++) {
            //     console.log(`Generating moment: ${currentMoment}.`);
            //     const momentPrompt = generateMomentImagePrompt(scenario, situation.title, situation.moments[currentMoment], character, setting);
            //     const momentImage = await generateImage(momentPrompt);
            //     momentImages.push({ title: situation.title, image: momentImage, moment: situation.moments[currentMoment] });
            // }
        }
        
        // Send the base64 string as a response
        return new Response(JSON.stringify({ "data": scenarioImage, situationImages }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }
};