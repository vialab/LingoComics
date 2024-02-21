import { v4 as uuidv4 } from 'uuid';
import { generateMoments, generateScenario, generateSituations, getScenarioTitle, getCharacterFromScenario, summarizeStory, summarizeSetting } from "$lib/services/gptService.js";


// story gen pipeline
// - create character attr
// - create scenario based on character
// - create situations based on scenario
// - create moment for each situation

export const POST = async ({ request }) => {
    const body = await request.json();

    console.log('image gen body:', body);

    const { title, setting, situation, tone, conflict } = body;

    try {
        // generate scenario
        const story : string = await generateScenario(title, setting, tone, conflict);

        // summarize story
        const summary : string = await summarizeStory(story);

        // summarize setting of the story
        const storySetting : string = await summarizeSetting(summary);

        // get title of scenario
        const scenario : string = await getScenarioTitle(story);

        // get character of scenario
        const character : string = await getCharacterFromScenario(story);

        // generate situations
        const situations = await generateSituations(story, situation, tone, conflict);

        // generate moments
        const structuredSituations = await generateMoments(situations, story, tone, conflict);

        // return response
        // const data = { scenarioId: uuidv4(), story: story, situations: situations};
        const data = { scenarioId: uuidv4(), story: story, summary: summary, scenario: scenario, setting: storySetting, character: character, situations: structuredSituations };

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generating scenario" }), { status: 500 });
    }
}