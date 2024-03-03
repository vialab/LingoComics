import { db } from '$lib/firebase/firebase.js';
import { collection, doc, getDoc, setDoc, query, getDocs, where, updateDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../utils/types.js';
import { Storage } from '@google-cloud/storage';
import { GOOGLE_API_KEY } from '$env/static/private';

// initiailize bucket
const storage = new Storage({ keyFilename: GOOGLE_API_KEY });
const bucketName = 'lingoimages';

// This POST request saves story generation items to firestore
export const POST = async ({ request }) => {
    const body = await request.json();
    const { story } = body;

    try {
        const docRef = doc(db, 'scenario', story.scenarioId);
        await setDoc(docRef, story);

        return new Response(JSON.stringify({ "data": "story successfully saved" }), { status: 200 });
    } catch (error) {
        console.error("Error saving story:", error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}

// upload to google storage bucket
async function uploadImage(base64String: string, fileName: string) {
    // return if no base64string
    if (base64String === undefined) {
        return null;
    }

    const strippedBase64String = base64String.split(';base64,').pop();
    if (typeof strippedBase64String !== 'string') {
        throw new Error('Invalid base64 string');
    }
    
    const imageBuffer = Buffer.from(strippedBase64String, 'base64');

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        await file.save(imageBuffer, {
            metadata: { contentType: 'image/png' }
        });

        // revise later coz idk if this is good practice
        await file.makePublic();

        console.log(`${fileName} uploaded to ${bucketName}`);

        return file;
    } catch (error) {
        console.error(error);
    }
}