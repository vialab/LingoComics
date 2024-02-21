import { generateMomentImagePrompt, generateScenarioImagePrompt, generateSituationImagePrompt } from '../../prompts.js';
import { generateImage } from '$lib/services/gptService.js';
import type { Moment } from '../../../scenario/data.js';

// type Moment = {
//     moment1: string,
//     moment2: string,
//     moment3: string,
//     moment4: string
// }

export const POST = async ({ request }) => {
    const body = await request.json();

    const { /*scenario,*/ situations, character, setting, summary } = body;

    // NOTE -> DUE TO MODIFICATIONS SUMMARY IS NOW SCENARIO, SCENARIO IS ONLY THE TITLE WHILE SUMMARY IS THE SCENARIO DESCRIPTION

    try {
        // generate scenario image
        const scenarioPrompt = generateScenarioImagePrompt(summary, character, setting);
        const scenarioImage  = await generateImage(scenarioPrompt);

        // generate situation images
        const situationImages = [];
        
        for (const situation of situations) {
            const situationPrompt = generateSituationImagePrompt(situation.title, summary, character, setting);
            const situationImage = await generateImage(situationPrompt);
            // situationImages.push(situationImage);

            // console.log(situation.moments);

            // convert moment objects into array of moment objects
            const momentsArray : Moment[] = Object.values(situation.moments);

            // generate moment images
            const momentImages = [];
            for (const moment of momentsArray) {
                console.log(`Generating moment: ${moment.momentSummarization}`);
                const momentPrompt = generateMomentImagePrompt(summary, situation.title, moment.momentImageDescriptionResponse, character, setting);
                const momentImage = await generateImage(momentPrompt);
                momentImages.push({ title: situation.title, image: momentImage, moment: moment.momentDescription });
            }
            situationImages.push({ situationImage, momentImages });

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