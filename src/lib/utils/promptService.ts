export function currentStoryStage(currentSituation: number, totalSituations: number): string {
    if (currentSituation === 1) {
        return "the start of the story";
    } else if (currentSituation === totalSituations) {
        return "the climax of the story";
    } else {
        return "the middle of the story";
    }
}

export function currentMomentStage(momentIndex: number, totalMoments: number, situationIndex: number, totalSituations: number) : string {
    // start of story
    if (situationIndex === 1) {
        return momentIndex === 1 ? `introduction of the story` : 'early development of the story';
    }

    // end of story
    else if (situationIndex === totalSituations) {
        return momentIndex === totalMoments ? 'conclusion of the story' : 'climax of the story';
    }

    // middle of the story
    else {
        if (momentIndex === 1) {
            return 'start of this part of the story'
        } else if (momentIndex === totalMoments) {
            return 'conclusion of this part and setup for next part';
        } else {
            return 'development of this part of the story';
        }
    }
} 