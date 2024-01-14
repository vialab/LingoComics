export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    return `
        Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs: 
        - title: ${title}
        - setting: ${setting}
        - tone: ${tone}
        - conflict ${conflict}
    `;
}


export function generateScenarioImagePrompt(scenario: string) {
    return `
        Generate a comic-style art image cover art for the scenario: ${scenario},
        The image should have NO chat bubbles and NO text in the image.
    `;
}

export function generateSituationsPrompt(situations: number, scenario: string, tone: string, conflict: string) {
    return `
        Based on the following scenario, generate ${situations} concise situations titles that fit within the story's context creating a natural story progression, essentially each situation is an arc of the scenario: 
        
        Scenario: '${scenario}'.

        The specifications for the situations and the story progression are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        The title should be concise, max 5 words.

        The output should be in the format Title: <title>
    `;
}

export function generateSituationImagePrompt(situation: string, scenario: string, moments: string) {
    return `
        Given the following piece of text: ${moments}, 
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
