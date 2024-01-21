import { generateCharacterAttributes } from "$lib/services/characterGenerator";
import { currentStoryStage } from "$lib/utils/promptService";

export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    // Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs:
    return `
        Provide a small title for a story with the following inputs:
        - title: ${title}
        - setting: ${setting}
        - tone: ${tone}
        - conflict ${conflict}
        The title should be max 5 words.
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

export function generateMomentPrompt(scenario: string, situation: string, tone: string, conflict: string) {
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

export function generateMoment(scenario: string, situation: string, tone: string, conflict: string, currentSituation: number, totalSituations: number) {
    const stageDescription = currentStoryStage(currentSituation, totalSituations);

    return `
        For the situation: '${situation}' which is part of the '${stageDescription}' of the story, generate moments that align with the overall scenario:

        Scenario: '${scenario}'
        Situation: '${situation}'

        The specifications for the moments and their alignment with the story are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        Generate concise description for the 4 key moments in this situation, outlining the progression of events.

        The output should be in the format Moment: <moment>
    `
}