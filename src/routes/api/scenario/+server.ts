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
    
    const { scenarioId, story, setting, character, scenario, image, situations, summary }: StoryStruct = body;


    // console.log("saving struct 1", situations[0].image);
    // console.log("saving struct 2", situations[0].image.momentImages[0].image.slice(0, 10));

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

            await updateDoc(scenarioDocRef, { 'title': scenario, 'image': `https://storage.googleapis.com/lingoimages/${scenarioImageFile?.name}`, 'story': story, 'setting': setting, 'character': character, 'summary': summary });
            console.log("updating document with id:", scenarioDocRef.id);
        // new scenario
        } else {
            console.log("This is a new scenario");
            scenarioDocRef = doc(scenariosCollectionRef, scenarioId);

            // upload scenario image
            const scenarioImageFile = await uploadImage(image, scenarioId); 

            await setDoc(scenarioDocRef, { scenarioId: scenarioId, 'title': scenario, 'image': `https://storage.googleapis.com/lingoimages/${scenarioImageFile?.name}`, 'story': story, 'setting': setting, 'character': character, 'summary': summary });
            console.log("Document created with ID:", scenarioDocRef.id);
        }

        // Process situations
        for (const situation of situations) {
            const situationId = situation.id; // Use a unique identifier for the situation
            const situationRef = doc(scenarioDocRef, 'situations', situationId);
        
            // Check if the situation exists
            const situationSnapshot = await getDoc(situationRef);
            console.log('saving situation', situation);

            if (situationSnapshot.exists()) {
                console.log("situation exists");

                // upload situation images
                const situationImageFile = await uploadImage(situation.image.situationImage, situationId);

                // Update existing situation
                await updateDoc(situationRef, { title: situation.title, situationSort: situation.situationSort, image: `https://storage.googleapis.com/lingoimages/${situationImageFile?.name}` });
            } else {
                console.log("situation does not exist");

                let situationImageFile = '';
                // upload situation images
                if (situation.image === undefined) {
                    situationImageFile = 'undefined';
                } else {
                    situationImageFile = await uploadImage(situation.image.situationImage, situationId);
                }

                // Create new situation
                await setDoc(situationRef, { id: situationId,  situationSort: situation.situationSort, title: situation.title, image: `https://storage.googleapis.com/lingoimages/${situationImageFile?.name}` });
            }

            // Process moments
            for (let currentMoment = 0; currentMoment < situation.moments.length; currentMoment++) {
                const momentId = `moment${currentMoment + 1}`;
                const momentRef = doc(situationRef, 'moments', momentId);

                // check if moment exists
                const momentSnapshot = await getDoc(momentRef);
                if (momentSnapshot.exists()) {
                    // upload moment images
                    const momentImageFile = await uploadImage(situation.image.momentImages[currentMoment].image, momentId);

                    // update existing moment
                    await updateDoc(momentRef, { description: situation.moments[currentMoment], image: `https://storage.googleapis.com/lingoimages/${momentImageFile?.name}` });
                } else {
                    let momentImageFile = '';
                    // upload moment images
                    if (situation.image === undefined) {
                        momentImageFile = 'undefined';
                    } else {
                        console.log('current MOMENT:', situation.image.momentImages[currentMoment]);
                        momentImageFile = await uploadImage(situation.image.momentImages[currentMoment].image, momentId);
                    }

                    // create a new moment
                    await setDoc(momentRef, { id: momentId, description: situation.moments[currentMoment], image: `https://storage.googleapis.com/lingoimages/${momentImageFile?.name}` });
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