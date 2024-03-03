import type { StoryStruct } from "../../utils/types";

// save story function
export async function saveStory(story: StoryStruct) {
    try {
        await fetch('/api/scenario', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ story })
        });
    } catch (error) {
        console.error("error saving story", error);
    }
}

// fetch story function
export async function fetchStory(scenarioId: string) {
    try {
        const response = await fetch(`/api/scenario/${scenarioId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log('fetched story:', data);
        return data;
    } catch (error) {
        console.error("error fetching story:", error);
    }
}

// export async function saveStory(scenarioImage: string, situationImages: string[], responseData: StoryStruct): Promise<void> {
//     // store images in responseData if they exist
//     if (situationImages.length > 0 && scenarioImage.length > 0) {
//         responseData!.image = scenarioImage;
//         responseData!.situations.forEach((situation, index) => {
//             situation.image = situationImages[index];
//         });
//     }

//     console.log('situation images:', responseData);

//     // call the api scenario
//     try {
//         const response = await fetch("/api/scenario", {
//             method: "POST",
//             body: JSON.stringify(responseData)
//         });
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//     }
// }

// fetch scenario from firestore
export async function getScenario(scenarioId: string) : Promise<void> {
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