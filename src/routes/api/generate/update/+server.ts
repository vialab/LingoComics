import { updateMoments, updateScenario } from '$lib/services/gptService.js';

export const PUT = async ({ request }) => {
    const body = await request.json();
    
    console.log('update', body);

    const { updateType, editText, story } = body;

    // set the edited text to update type for story structure
    story[updateType] = editText;

    try {
        // update story
        const updatedStory : string = await updateScenario(story.story, editText, updateType);
        story.story = updatedStory;

        // update situations
        const updatedSituations = await updateMoments(updatedStory, story.situations, editText, updateType);
        story.situations = updatedSituations;

        console.log("**Updated story**:", story);

        return new Response(JSON.stringify({ story: story }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generation scenario" }), { status: 500 });
    }
}