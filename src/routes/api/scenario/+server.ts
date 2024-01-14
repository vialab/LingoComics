import { db } from '$lib/firebase/firebase.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { collection, addDoc, doc, getDoc, setDoc, query, getDocs, where, updateDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../utils/types.js';
import { Storage } from '@google-cloud/storage';
import { GOOGLE_API_KEY } from '$env/static/private';

// initiailize bucket
const storage = new Storage({ keyFilename: GOOGLE_API_KEY });
const bucketName = 'lingoimages';

export const POST = async ({ request }) => {
    const body = await request.json();
    
    const { scenarioId, scenario, image, situations }: StoryStruct = body;


    try {
        const scenariosCollectionRef = collection(db, 'scenario');
        const q = query(scenariosCollectionRef, where("scenarioId", "==", scenarioId));
        const querySnapshot = await getDocs(q);

        let scenarioDocRef;
        // existing scenario
        if (!querySnapshot.empty) {
            console.log("This scenario already exists");
            scenarioDocRef = querySnapshot.docs[0].ref;

            // upload scenario image
            const scenarioImageFile = await uploadImage(image, scenarioId);

            await updateDoc(scenarioDocRef, { 'title': scenario, 'image': `https://storage.googleapis.com/lingoimages/${scenarioImageFile?.name}` });
            console.log("updating document with id:", scenarioDocRef.id);
        // new scenario
        } else {
            console.log("This is a new scenario");
            scenarioDocRef = doc(scenariosCollectionRef, scenarioId);

            // upload scenario image
            const scenarioImageFile = await uploadImage(image, scenarioId); 

            await setDoc(scenarioDocRef, { scenarioId: scenarioId, 'title': scenario, 'image': `https://storage.googleapis.com/lingoimages/${scenarioImageFile?.name}` });
            console.log("Document created with ID:", scenarioDocRef.id);
        }

        // Process situations
        for (const situation of situations) {
            const situationId = situation.id; // Use a unique identifier for the situation
            const situationRef = doc(scenarioDocRef, 'situations', situationId);
        
            // Check if the situation exists
            const situationSnapshot = await getDoc(situationRef);
            if (situationSnapshot.exists()) {
                // upload situation images
                const situationImageFile = await uploadImage(situation.image, situationId);

                // Update existing situation
                await updateDoc(situationRef, { title: situation.title, image: `https://storage.googleapis.com/lingoimages/${situationImageFile?.name}` });
            } else {
                // upload situation images
                const situationImageFile = await uploadImage(situation.image, situationId);

                // Create new situation
                await setDoc(situationRef, { id: situationId, title: situation.title, image: `https://storage.googleapis.com/lingoimages/${situationImageFile?.name}` });
            }
        
            // Process moments
            for (const [key, value] of Object.entries(situation.moments)) {
                const momentId = key; // Assuming 'key' is a unique identifier for the moment
                const momentRef = doc(situationRef, 'moments', momentId);
            
                // Check if the moment exists
                const momentSnapshot = await getDoc(momentRef);
                if (momentSnapshot.exists()) {
                    // Update existing moment
                    await updateDoc(momentRef, { description: value });
                } else {
                    // Create new moment
                    await setDoc(momentRef, { id: momentId, description: value });
                }
            }
        }

        return new Response(JSON.stringify({ "data": scenarioId }), { status: 200 });
    } catch (error) {
        console.error("Error saving story:", error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}

// upload to google storage bucket
async function uploadImage(base64String: string, fileName: string) {
    const strippedBase64String = base64String.split(';base64,').pop();
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