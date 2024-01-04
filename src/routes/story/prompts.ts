export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    return `
        Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs: 
        - title: ${title}
        - setting: ${setting}
        - tone: ${tone}
        - conflict ${conflict}
    `;
}

export function generateSituationsPrompt(situations: number, scenario: string, tone: string, conflict: string) {
    return `
        Based on the following scenario, generate ${situations} concise situations titles that fit within the story's context creating a natural story progression, essentially each situation is an arc of the scenario: 
        
        Scenario: '${scenario}'.

        The specifications for the situations are based on the following:
        - tone: '${tone}'
        - conflict: '${conflict}'

        The title should be concise like the scenario.

        The output should be in the format Title: <title>
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