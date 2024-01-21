import { v4 as uuidv4 } from 'uuid';
import { generateCharacterDescription, generateMoments, generateScenario, generateSituations } from "$lib/services/gptService.js";

// story gen pipeline
// - create character attr
// - create scenario based on character
// - create situations based on scenario
// - create moment for each situation

export const POST = async ({ request }) => {
    const body = await request.json();

    const { title, setting, situation, tone, conflict } = body;

    try {
        // generate character
        const character : string = await generateCharacterDescription();

        // generate scenario
        const scenario : string = await generateScenario(title, setting, tone, conflict);

        // generate situations
        const situations = await generateSituations(scenario, situation, tone, conflict);

        // generate moments
        const structuredSituations = await generateMoments(situations, scenario, tone, conflict);

        const data = { scenarioId: uuidv4(), character: character, scenario: scenario, situations: structuredSituations };

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
}

// export const POST = async ({ request }) => {
//     const body = await request.json();

//     const { title, setting, situation, tone, conflict } = body;
    
//     try {
//         // scenario prompt and response
//         const scenarioPrompt : string = generateScenarioPrompt(title, setting, tone, conflict);
//         const scenario = (await gptPrompt(openai, model, scenarioPrompt)).choices[0].message.content;

//         // situation prompt and response
//         const totalSituations = Number(situation);
//         let previousSituationTitle : string | undefined = '';
//         const situations = [];

//         for (let currentSituation = 1; currentSituation <= totalSituations; currentSituation++) {
//             const situationPrompt = generateSituationPrompt(scenario!, tone, conflict, currentSituation, totalSituations, previousSituationTitle);
//             const situationResponse = (await gptPrompt(openai, model, situationPrompt)).choices[0].message.content;
//             const situationTitle = situationResponse?.split('Title: ')[1].trim();

//             situations.push({ title: situationTitle });

//             // update for next iteration
//             previousSituationTitle = situationTitle;
//         }

//         // generate moment for each situation
//         const momentsPromises = situations.map(async (situation, currentSituation) => {
//             const momentPrompt : string = generateMoment(scenario!, situation?.title, tone, conflict, currentSituation, totalSituations);
//             const response = await gptPrompt(openai, model, momentPrompt);
//             return response.choices[0].message.content;
//         });
//         const moments = await Promise.all(momentsPromises);

//         // create structured situation object
//         const structuredSituations = situations.map((situation, index) => {
//             const allMoments = moments[index]?.split('\n').filter(line => line.trim() !== '');
//             const momentsObject : MomentObject = allMoments!.reduce((acc, moment, idx) => {
//                 // Remove the prefixes like '1. Moment:' or 'Moment 1:'
//                 const cleanedMoment = moment.replace(/^\d+\. Moment: |Moment \d+: /, '');
//                 acc[`moment${idx + 1}`] = cleanedMoment;

//                 return acc;
//             }, {} as MomentObject);

//             return {
//                 id: uuidv4(),
//                 title: situation?.title,
//                 moments: momentsObject
//             };
//         });

//         // create response data object
//         const data = { scenarioId: uuidv4(), scenario: scenario, situations: structuredSituations };

//         return new Response(JSON.stringify(data), { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
//     }
// }