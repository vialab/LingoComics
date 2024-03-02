export function updateStoryContext(story: string, updatedContent: string, updateType: string) {
    return `
        Given the following story: "${story}".
        Update the context so that ${updateType} from the story is more aligned to this new update ${updateType}: ${updatedContent}.
        Make sure NOT to change the context of the story when applying the content.
        Give the update story as a result with the updated content.
    `;
}