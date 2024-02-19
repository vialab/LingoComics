import { currentMomentStage, currentStoryStage } from "$lib/utils/promptService";


export function getScenarioTitlePrompt(story: string) {
    return `What is the title of this story? '${story}'. ONLY Provide the title.`;
}

export function getCharacterPrompt(story: string) {
    return `
        Who is the main character in this story? ${story}. 
        Based on the what you think the character should look like in appearance, 
        generate a description of them that will best fit the story. 
        Make the description focus only on appearance and one that will help an image generation tool.
        The description should have the following:
        - hair color
        - hair style
        - eye description
        - face description
        - clothing description
        - ethnicity
        THE DESCRIPTION MUST BE BRIEF AND TO THE POINT.
    `;
}

export function summarizeStoryPrompt(story: string) {
    return `Generate a brief description this story: ${story}.`;
}

export function summarizeMoment(moment: string) {
    return `
        Summarize the following moment: ${moment}, highlighting the key aspects in 10-15 words or less.
    `;
}

export function getStorySetting(storySummary: string) {
    return `
        Given the summary of the story: ${storySummary}, 
        generate a detailed description of the setting, 
        focusing on sensory details, 
        the atmosphere, 
        and key features that define the space. 
        THE DESCRIPTION MUST BE BRIEF AND TO THE POINT.
    `;
}


export function generateCharacterPrompt(characterDescription: string) {
    return `
        Provide a concise and detailed description of a protagonist for a 
        comic-book story that can be used to create an image of the character using DALLE.
        Character description: ${characterDescription}.
    `;
}

// prompt for generating the actual story
export function generateScenarioPrompt(title: string, setting: string, tone: string, conflict: string) {
    // Provide only the title which is as concise as but not the same as 'First day at work', 'Lost in Tokyo', 'First day at school', 'Eating at a restaurant', for an interactive story and based on the following inputs:
    return `
        Generate a story that is contextually relatable to everyday real-world experiences. The title should reflect common situations people might encounter, such as 'First day at work', 'Lost in a city', or 'First day at school'. Use the following inputs to inform the title, ensuring it aligns with these themes:

        - Premise: ${title}
        - Setting: ${setting}
        - Tone: ${tone}
        - Conflict: ${conflict}

        The story should evoke a scenario that is easy to visualize and relate to. Examples of such titles include 'Eating at a restaurant', 'Meeting new neighbors', or 'Exploring a new city'. Avoid overly specific or niche scenarios to maintain broad relatability.
    `;
}

// prompt for generating situation
export function generateSituationPrompt(scenario: string, tone: string, conflict: string, currentSituation: number, totalSituations: number, previousSituation?: string) {
    // get which stage story is on based on index
    const stageDescription = currentStoryStage(currentSituation, totalSituations);

    console.log('stage description: ', stageDescription);

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

// prompt for generating moments
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
        The description should include any action that the character should perform so that an image generation model can generate an image based on the description.

        The output should be in the format Moment ${currentMoment}: <moment>
    `;
}

export function generateMomentDescriptionPrompt(story: string, situation: string, moment: string) {
    return `
        Create a brief description for the following moment: "${moment}".
        The description should be descriptive as to summarize the visual aspects of the moment for an image generation tool to generate, 
        make sure the actions in the moment are a key part of the description.
    `;
    // Analyze this story: ${story}.
    //     Then analyze this situation that is part of the story: ${situation}.
    //     Then analyze this moment that is part of the situation: ${moment}.
    //     The character in the story should convey the emotions of the moment that they are in.
    //     Provide a brief description of what an image would look like for the moment, 
    //     this description should be detailed enough for an AI image generation tool to generate while also keeping in mind the tokens, 
    //     so don't overexceed on the description but the description should encapsulate the key parts of the moment. 
    //     LIMIT 300 tokens.

    // Analyze the story: ${story} to understand its overarching themes and emotions. 
    // Focus on this particular situation within the story: ${situation}, to grasp the context and emotional undertones. 
    // Delve into this specific moment: ${moment}, highlighting the pivotal emotions and the atmosphere that define it. 
    // Consider the character's emotional state and how it is influenced by the surroundings and the situation at hand.

    // Craft a description for an image that captures the essence of this moment, emphasizing the character's emotions, the ambiance, and any significant elements that contribute to the tone. 
    // Ensure the description is concise yet rich enough to guide an AI in generating an image that reflects the key aspects of the moment, including the emotional depth and the setting, without exceeding 300 tokens. Aim for a balance between character portrayal and the depiction of the moment's mood and context.
    
}

export function generateScenarioImagePrompt(scenario: string, characterDescription: string, setting: string) {
    return `
        Generate a concise summarization of the following scenario: ${scenario}.
        The description of the setting is: ${setting}.
        Create a single comic-style cover image without typography that will capture the essense of the overall scenario, without any text or speech bubbles.
        The artwork should capture the essence of the scenario WITHOUT including any text or words in the image. 
        The scenario should be the focal point of the image with an environment that has the character: ${characterDescription} in it. 
        Ensure the image is dynamic and conveys a sense of narrative or action related to the scenario.
        THE IMAGE HAS TO BE COMIC-STYLE.
    `;
}

export function generateSituationImagePrompt(situation: string, scenario: string, characterDescription: string, setting: string) {
    return `
        Generate a concise summarization of the following scenario: ${scenario}.
        The situation that happens in the scenario is: ${situation}.
        The description of the setting is: ${setting}.
        Create a single comic-style cover image without typography that will capture the essense of the overall scenario that relates to the title of the situation, without any text or speech bubbles.
        The artwork should capture the essence of the situation WITHOUT including any text or words in the image.
        The situation should be the focal point of the image with an environment that has the character: ${characterDescription}.
        Ensure the image is dynamic and conveys a sense of narrative or action related to the scenario.
        THE IMAGE HAS TO BE COMIC-STYLE.
    `;
}

export function generateMomentImagePrompt(scenario: string, situation: string, moment: string, characterDescription: string, setting: string) {
    return `
        "Craft a comic-style illustration capturing a pivotal moment: "${moment}". 
        The scene stars a character described as follows: "${characterDescription}",
        set against the backdrop of "${setting}". 
        The focal point of this artwork should be the specific action unfolding during this moment, 
        imbued with dynamic expressions and movements characteristic of comic book art. Ensure the image embodies the vibrant,
        bold lines and dramatic shading typical of comic illustrations, with special attention to how the character's emotions 
        and the setting contribute to the narrative of the action. The composition should be dynamic, emphasizing the action 
        to engage the viewer, true to the essence of comic-style storytelling."
        Use the prompt AS-IS. THE IMAGE HAS TO BE COMIC-STYLE.
    `;
    // Create a comic-style image for the moment: "${moment}".
    //     This is the character: "${characterDescription}".
    //     This is the setting: "${setting}".
    //     The highlight of the image should be the action that should be performed in the moment.
    //     THE IMAGE HAS TO BE COMIC-STYLE.
}


/**
 * 
 * Given this moment ${moment}.
        Create a comic-style image WITHOUT typography that will CLEARLY HIGHLIGHT actions that happen in the moment.
        The character that should be in the image has this description: ${characterDescription}.
        The character should be in the image performing the action highlighted in the moment.
        The description of the setting is: ${setting}.
 * 
 * Given this moment: ${moment}.
        Create a comic-style image WITHOUT typography that will capture the essence of the overall moment, put emphasis on the action that the moment should convey in an image.
        The artwork should capture the essence of the moment WITHOUT including any text or words in the image.
        The description of the moment should be the focal point of the image with an environment that has the character: ${characterDescription}.
        The character should be performing the action or main focus point of the moment to get the point across of the current moment they are in.
        The description of the setting is: ${setting}.
 */
// export function generateSituationImagePrompt(situation: string, scenario: string, moments: string) {
//     return `
//         Given the following small paragraph: ${moments}, 
//         summarize the text and generate a comic-style art image cover art that will be the best fit for the situation: ${situation} 
//         that is for the following scenario: ${scenario}.

//         Image should have NO chat bubbles and NO text in the image.
//     `;
// }