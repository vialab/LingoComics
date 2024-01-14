import type { StoryStruct } from "../../utils/types";

// save story function
export async function saveStory(scenarioImage: string, situationImages: string[], responseData: StoryStruct): Promise<void> {
    // store images in responseData if they exist
    if (situationImages.length > 0 && scenarioImage.length > 0) {
        responseData!.image = scenarioImage;
        responseData!.situations.forEach((situation, index) => {
            situation.image = situationImages[index];
        });
    }

    // call the api scenario
    try {
        const response = await fetch("/api/scenario", {
            method: "POST",
            body: JSON.stringify(responseData)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// fetch scenario from firestore
export async function getScenario(scenarioId: string) : Promise<any> {
    try {
        const response = await fetch(`/api/scenario/${scenarioId}`, {
            method: "GET",  
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// generate images
export async function generateImages(responseData: StoryStruct | null) {
    try {
        const response = await fetch(`/api/generate/images`, {
            method: "POST",
            body: JSON.stringify(responseData)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}