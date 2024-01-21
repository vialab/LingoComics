import { generateCharacterAttributes } from "$lib/services/characterGenerator";
import { currentMomentStage, currentStoryStage } from "$lib/utils/promptService";

export function generateCharacterPrompt(characterDescription: string) {
    return `
        Provide a detailed description of a protagonist for a comic-book story that can be used to create an image of the character using DALLE.
        Character description: ${characterDescription}
    `;
}

export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    // Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs:
    return `
        Generate a title for an interactive story that is contextually relatable to everyday real-world experiences. The title should reflect common situations people might encounter, such as 'First day at work', 'Lost in a city', or 'First day at school'. Use the following inputs to inform the title, ensuring it aligns with these themes:

        - Suggested Title: ${title}
        - Setting: ${setting}
        - Tone: ${tone}
        - Conflict: ${conflict}

        The title should be concise, no more than 5 words, and should evoke a scenario that is easy to visualize and relate to. Examples of such titles include 'Eating at a restaurant', 'Meeting new neighbors', or 'Exploring a new city'. Avoid overly specific or niche scenarios to maintain broad relatability.
    `;
}

export function generateScenarioImagePrompt(scenario: string) {
    // generate random character 
    const characterDescription = generateCharacterAttributes();
    console.log(characterDescription);
    return `
        Generate a comic-style art image cover art for the scenario: ${scenario}, and the description for the character is: ${characterDescription}.
        Provide the gen_id for the image as well.
    `;
}

// old situation prompt generation
export function generateSituationsPrompt(situations: number, scenario: string, tone: string, conflict: string) {
    return `
        Based on the following scenario, generate ${situations} concise situations titles that fit within the story's context creating a natural story progression, essentially each situation is an arc of the scenario: 
        
        Scenario: '${scenario}'.

        The specifications for the situations and the story progression are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        The title should be concise, max 5 words.

        The situation titles should have a clear story outlined, such as the start of the story, the middle of the story, and the end of the story.

        The output should be in the format Title: <title>
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

        The output should be in the format: Title: <title>
    `;
}

export function generateSituationImagePrompt(situation: string, scenario: string, moments: string) {
    return `
        Given the following small paragraph: ${moments}, 
        summarize the text and generate a comic-style art image cover art that will be the best fit for the situation: ${situation} 
        that is for the following scenario: ${scenario}.

        Image should have NO chat bubbles and NO text in the image.
    `;
}

export function generateMomentsPrompt(scenario: string, situation: string, tone: string, conflict: string) {
    return `
        For the following situation. generate 4 key moments that fit within the story's context creating.

        Scenario: '${scenario}'
        Situation: '${situation}'

        The specifications for the situations are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        Provide a concise one-sentence brief for each key moment.

        The output should be in the format Moment: <moment>
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

        Generate concise description for moment ${currentMoment} in this situation, outlining the progression of events.

        The output should be in the format Moment ${currentMoment}: <moment>
    `;
}