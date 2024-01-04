import { db } from '$lib/firebase/firebase.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../utils/types.js';


export const POST = async ({ request }) => {
    const body = await request.json();
    
    const { scenarioId, scenario, situations } : StoryStruct = body;

    console.log(scenarioId, scenario, situations);

    try {
        // check if scenario exists
        const scenarioDocRef = doc(db, 'scenario', scenarioId);

        const docSnap = await getDoc(scenarioDocRef);

        console.log(docSnap);

        // if (docSnap.exists()) {
        //     await setDoc(scenarioDocRef, { scenarioId: scenarioId, 'title': scenario, 'image': '' }, { merge: true });
        //     console.log("document overwritten:", scenarioDocRef.id);
        // } else {
        //     // create new document with an auto-generated ID
        //     const docRef = await addDoc(collection(db, 'scenario'), { scenarioId: scenarioId, 'title': scenario, 'image': '' });
        //     console.log("document written with ID:", docRef.id);
        // }

        
        return new Response(JSON.stringify({ "data": scenarioId }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}