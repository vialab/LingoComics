export function updateStoryContextPrompt(story: string, updatedContent: string, updateType: string) {
    return `
        Given the following story: "${story}".
        Update the context of the story so that the '${updateType}' from the story is more aligned to this new update '${updateType}': ${updatedContent}.
        Make sure NOT to change the context of the story when applying the content.
        Give the update story as a result with the updated content.
    `;
}

export function updateMomentDescriptionContextPrompt(story: string, moment: string, updatedContent: string, updateType: string) {
    return `
        REPLACE the ${updateType} in this moment: ${moment} with the ${updateType} mentioned in "${updatedContent}".
    `;
    // console.log("updating:", moment, updatedContent, updateType);
    // return `
    //     Given the following story: "${story}".
    //     Update the ${updateType} of this moment: ${moment} and change the moment to reference this updated content: ${updatedContent}.
    //     The update of the moment should only change the '${updateType}' referred in the updated content.
    // `;
}

export function updateMomentImageContextPrompt(story: string, momentImageDescription: string, updatedContent: string, updateType: string) {
    return `
        Given the following story: "${story}.
        Here is the image description of a moment that happens in it: ${momentImageDescription}.
        Update the image description of this moment for the ${updateType} with the new update content: ${updatedContent}.
        The updated description should not change the context of the story only the ${updateType}.
    `;
}