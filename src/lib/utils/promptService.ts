export function currentStoryStage(currentSituation: number, totalSituations: number): string {
    let stageDescription = "";
    if (currentSituation === 1) {
        return "the start of the story";
    } else if (currentSituation === totalSituations) {
        return "the climax of the story";
    } else {
        return "the middle of the story";
    }
}