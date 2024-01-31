import { currentMomentStage, currentStoryStage } from "$lib/utils/promptService";


export function getScenarioTitlePrompt(story: string) {
    return `What is the title of this story? '${story}'. ONLY Provide the title.`;
}

export function getCharacterPrompt(story: string) {
    return `Who is the main character in this story? ${story}. Based on the what you think the character should look like in appearance, generate a description of them that will best fit the story.`;
}

export function summarizeStoryPrompt(story: string) {
    return `Summarize this story: ${story} `
}

export function getStorySetting(storySummary: string) {
    return `Given the summary of the story: ${storySummary}, generate a description of what the setting would be.`;
}


export function generateCharacterPrompt(characterDescription: string) {
    return `
        Provide a concise and detailed description of a protagonist for a comic-book story that can be used to create an image of the character using DALLE.
        Character description: ${characterDescription}
    `;
}

export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    // Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs:
    return `
        Generate a story that is contextually relatable to everyday real-world experiences. The title should reflect common situations people might encounter, such as 'First day at work', 'Lost in a city', or 'First day at school'. Use the following inputs to inform the title, ensuring it aligns with these themes:

        - Suggested Title: ${title}
        - Setting: ${setting}
        - Tone: ${tone}
        - Conflict: ${conflict}

        The story should evoke a scenario that is easy to visualize and relate to. Examples of such titles include 'Eating at a restaurant', 'Meeting new neighbors', or 'Exploring a new city'. Avoid overly specific or niche scenarios to maintain broad relatability.
    `;
}

export function generateSituationPrompt(scenario: string, tone: string, conflict: string, currentSituation: number, totalSituations: number, previousSituation?: string) {
    // get which stage story is on based on index
    const stageDescription = currentStoryStage(currentSituation, totalSituations);

    return `
        Based on the following scenario, generate a concise situation title that fits within the story's context and aligns with the current stage of the story ${stageDescription}:

        Scenario: '${scenario}'.
        Previous situation: '${previousSituation || 'N/A'}'

        The specification for this situation and the story progression are based on the following:
        - Tone: '${tone}'
        - Conflict: '${conflict}'

        The title should be concise, max 5 words.

        The title should reflect common situations people might encounter, and have it make sense to the overall story and the current stage of the story: ${stageDescription}.

        The output should be in the format: Title: <title>
    `;
}

export function generateMomentPrompt(situationTitle: string, scenario: string, tone: string, conflict: string, currentMoment: number, totalMoments: number, currentSituation: number, totalSituations: number, previousSituation?: string, nextSituation?: string) {
    const stageDescription = currentMomentStage(currentMoment, totalMoments, currentSituation, totalSituations);

    return `
        For the situation: '${situationTitle}' which is part of the '${stageDescription}' of the story, generate moments that align with the overall scenario:

        Scenario: '${scenario}'
        Situation: '${situationTitle}'
        Previous situation: '${previousSituation || 'N/A'}'
        Next situation: ${nextSituation || 'N/A'}

        The specifications for the moments and their alignment with the story are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        Generate very concise description for moment ${currentMoment} in this situation, outlining the progression of events.

        The output should be in the format Moment ${currentMoment}: <moment>
    `;
}

export function generateScenarioImagePrompt(scenario: string, characterDescription: string, setting: string) {
    return `
        Summarize the following scenario: ${scenario}.
        The description of the setting is: ${setting}.
        Create a single comic-style cover image without typography that will capture the essense of the overall scenario, without any text or speech bubbles.
        The artwork should capture the essence of the scenario WITHOUT including any text or words in the image. 
        The scenario should be the focal point of the image with an environment that has the character: ${characterDescription} in it. 
        Ensure the image is dynamic and conveys a sense of narrative or action related to the scenario.
    `;
}

export function generateSituationImagePrompt(situation: string, scenario: string, characterDescription: string, setting: string) {
    return `
        Summarize the following scenario: ${scenario}.
        The situation that happens in the scenario is: ${situation}.
        The description of the setting is: ${setting}.
        Create a single comic-style cover image without typography that will capture the essense of the overall scenario that relates to the title of the situation, without any text or speech bubbles.
        The artwork should capture the essence of the situation WITHOUT including any text or words in the image.
        The situation should be the focal point of the image with an environment that has the character: ${characterDescription}.
        Ensure the image is dynamic and conveys a sense of narrative or action related to the scenario.
    `;
}

export function generateMomentImagePrompt(scenario: string, situation: string, moment: string, characterDescription: string, setting: string) {
    return `
        Given the summary of the scenario: ${scenario}, and the situation: ${situation}, and the description of the moment: ${moment}.
        Create a single comic-style image without typography that will capture the essence of the overall moment.
        The artwork should capture the essence of the moment WITHOUT including any text or words in the image.
        The description of the moment should be the focal point of the image with an environment that has the character: ${characterDescription}.
        The description of the setting is: ${setting}.
    `;
}


// export function generateSituationImagePrompt(situation: string, scenario: string, moments: string) {
//     return `
//         Given the following small paragraph: ${moments}, 
//         summarize the text and generate a comic-style art image cover art that will be the best fit for the situation: ${situation} 
//         that is for the following scenario: ${scenario}.

//         Image should have NO chat bubbles and NO text in the image.
//     `;
// }