import { generateImageNoSave } from '$lib/services/gptService.js';
import type { Scene, StoryStruct } from '../../../../../../../utils/types.js';
import { generateNewImagePrompt } from '../../../../../prompts.js';

export const POST = async ({ request }) => {
    const body = await request.json();

    let scenario : StoryStruct = body.scenario;
    let scene : Scene = body.scene;


    try {
        // generate new scene
        const newScenePrompt = generateNewImagePrompt(scenario.character, scenario.setting, scenario.scenario, scene.narrative);
        const newScene = await generateImageNoSave(newScenePrompt);

        return new Response(JSON.stringify({ "image": newScene }), { status: 200 });
    } catch (error) {
        console.error("Error generating image:", error);        
        return new Response(JSON.stringify({ "error": "error occurred when generating images" }), { status: 500 });
    }
}