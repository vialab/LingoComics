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
        - name of character
        - male or female
        - hair color
        - hair style
        - eye description
        - face description
        - clothing description
        - ethnicity
        THE DESCRIPTION MUST BE BRIEF AND TO THE POINT.
        Be descriptive about the description and return in the list format specified.
    `;
}

export function summarizeStoryPrompt(story: string) {
    return `Generate a brief description this story: ${story}.`;
}

export function summarizeMoment(moment: string) {
    return `
        Summarize the following moment: ${moment}, highlighting the key aspects in 8-10 words or less. The summarization should highlight a distinct action if the moment describes one.
    `;
}

export function getStorySetting(storySummary: string) {
    return `
        Given the summary of the story: ${storySummary}, 
        generate a description that will best fit the story.
        The description should have the following:
        - ambiance
        - atmosphere
        - lighting
        THE DESCRIPTION MUST BE BRIEF AND TO THE POINT.
        Be descriptive about the description and return in the exact list format specified no numbers.
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
        The story should be relatable for example, a person in a story struggling to order a coffee, or talking to a stranger, or being lost in a city.
    `;
}

// prompt for generating situation
export function generateSituationPrompt(scenario: string, tone: string, conflict: string, currentSituation: number, totalSituations: number, previousSituation?: string) {
    // get which stage story is on based on index
    const stageDescription = currentStoryStage(currentSituation, totalSituations);

    console.log('stage description:', stageDescription, previousSituation);

    return `
        Based on the following scenario, generate a concise situation title that fits within the story's context 
        and aligns with the CURRENT STAGE/ARC of the story ${stageDescription}.

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
        The description should include any action that the character should perform so that an image generation model can generate an image based on the description and the character should be interacting with another person or object.

        The output should be in the format Moment ${currentMoment}: <moment>
    `;
}

// used for image description
export function generateMomentDescriptionPrompt(story: string, situation: string, moment: string) {
    return `
        Create a brief image description for the following moment: "${moment}".
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
        to engage the viewer, true to the essence of comic-style storytelling.
        The character should be performing action if it makes sense to the moment, and should be showing emotion as part of the moment.
        Specify the camera angle which the scene is viewed at as well.
        Use the prompt AS-IS. THE IMAGE HAS TO BE COMIC-STYLE.
    `;
    // Create a comic-style image for the moment: "${moment}".
    //     This is the character: "${characterDescription}".
    //     This is the setting: "${setting}".
    //     The highlight of the image should be the action that should be performed in the moment.
    //     THE IMAGE HAS TO BE COMIC-STYLE.
}


export function getKeywordPrompts(text: string) {
    return `
        Given this sentence: ${text}, give me 3 keywords within the sentence. 
        Only return the word and a short description as to its significance.
        Return exactly in the format: "[word]: [description]".
    `;
}

export function translateTextPrompt(text: string, language: string) {
    return `
        Translate this text: ${text} to ${language}.
        Only give the translation.
    `;
}

export function generateNarrativePrompt(text: string) {
    return `
        Generate a small length sentence for this piece of text: ${text}. 
        Make the tone of sentence be in a narrative perspective so as to set up a scene for the same story in the sentence.
    `;
}

export function generateNextStepPrompt(text: string) {
    return `
        Generate a small length instruction for this narrative: "${text}".
        Make the tone of the sentence be in a "next step" narrative perspective, 
        for example, "what should [person] do next", but make sure to have the sentence fit 
        the context. Make the sentence small. Have the sentence be in the perspective of the main character in the narrative.
    `;
}

export function generateOptions(text: string) {
    return `
        Generate 3 short, contextually relevant dialogue options based on the following text: ${text}.
        Each option should represent a possible way a character might respond or what they might do next in the scenario.
        Keep the options concise and ensure they lead to different narrative branches.
        The branches should be relatable in context to the user. The format should be like: "[num]: [option]".
    `
}

export function generateContinueNarrativePrompt(previousOption: string, selectedOption: string) {
    return `
        Generate a small length sentence for: ${selectedOption}.
        Make the tone of the sentence be in a narrative perspective so as to set up a scene for the same story in the sentence.
        The last narrative for the story was: ${previousOption} and so make the continuation of the new narrative flow with this in mind, so make the new small length narrative option adhere to the new option.
    `;
}

export function generateNewImagePrompt(characterDescription: string, setting: string, storyTitle: string, narrative: string, selectedOption: string) {
    // return `
    //     Generate an image description that will be suitable for DALLE to generate, for: "${narrative}", for the story: ${storyTitle}.
    //     The description of the character in the image is: ${characterDescription}.
    //     The setting of the image should be: ${setting}.
    //     Image is of a side-view camera angle to showcase the character's action and broader scene context.
    //     The image should be a comic-style image.
    // `;
    return `
        Create a detailed comic-style image that captures a scene from the story titled "${storyTitle}". 
        In this scene, the narrative unfolds as: "${narrative}", and the character has chosen to: "${selectedOption}".
        The character is described as: ${characterDescription}. 
        They should be depicted within the setting of ${setting}, which can be modified to fit the narrative's progression.
        The image should emphasize the character's emotions and interactions relevant to the narrative's context.
        If the narrative involves interaction with another character, this character should also be included, depicted in a manner that complements the main character's actions.
        The main character should not be facing the viewer directly; they should be engaged in an action that reflects the chosen narrative path.
        Opt for a side view camera angle to showcase both the character's actions and the broader scene context.
    `;
    // return `
    //     Generate a comic-style image for the story: "${storyTitle}".
    //     The current narrative of the story is as follows: "${narrative}".
    //     The selected option that the character should follow as part of the narrative is: "${selectedOption}".
    //     The character description is: ${characterDescription}.
    //     The setting is: ${setting}.
    //     The image should convey the character's emotion and interacting with any substance that the current narrative describes.
    //     The setting can be altered slightly to adhere to the current narrative. 
    //     If the narrative and selected option demands the character interacting with another person, then include the other person as well in the image.
    //     The character should NOT be looking directly at the screen, rather they should interact or perform some sort of action that makes sense for the current narrative that is outlined.
    //     Camera angle of the image should be a side view of the character and scene.
    // `;
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