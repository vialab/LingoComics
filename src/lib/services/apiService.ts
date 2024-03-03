// import { GOOGLE_API_KEY } from "$env/static/private";
import type { StoryStruct } from "../../utils/types";

// initialize bucket
// const storage = new Storage({ keyFilename: GOOGLE_API_KEY });
// const bucketName = 'lingoimages';

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

        console.log("story saved");
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

// upload to google storage bucket
// export async function uploadImage(base64String: string, fileName: string) {
//     // return if no base64string
//     if (base64String === undefined) {
//         return null;
//     }

//     const strippedBase64String = base64String.split(';base64,').pop();
//     if (typeof strippedBase64String !== 'string') {
//         throw new Error('Invalid base64 string');
//     }

//     const imageBuffer = Buffer.from(strippedBase64String, 'base64');

//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(fileName);

//     try {
//         await file.save(imageBuffer, {
//             metadata: { contentType: 'image/png' }
//         });

//         await file.makePublic();

//         return file;
//     } catch (error) {
//         console.error('error uploading image', error);   
//     }
// }