import { db } from '$lib/firebase/firebase.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { collection, addDoc, doc, getDoc, setDoc, query, getDocs, where, updateDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../utils/types.js';

export const POST = async ({ request }) => {
    const body = await request.json();
    
    const { scenarioId, scenario, situations }: StoryStruct = body;

    try {
        const scenariosCollectionRef = collection(db, 'scenario');
        const q = query(scenariosCollectionRef, where("scenarioId", "==", scenarioId));
        const querySnapshot = await getDocs(q);

        let scenarioDocRef;
        if (!querySnapshot.empty) {
            console.log("This scenario already exists");
            scenarioDocRef = querySnapshot.docs[0].ref;
            await updateDoc(scenarioDocRef, { 'title': scenario, 'image': '' });
        } else {
            console.log("This is a new scenario");
            scenarioDocRef = doc(scenariosCollectionRef, scenarioId);
            await setDoc(scenarioDocRef, { scenarioId: scenarioId, 'title': scenario, 'image': '' });
            console.log("Document created with ID:", scenarioDocRef.id);
        }

        // Process situations
        for (const situation of situations) {
            const situationRef = doc(scenarioDocRef, 'situations', situation.title);
            await setDoc(situationRef, { title: situation.title }, { merge: true });

            // Process moments
            for (const [key, value] of Object.entries(situation.moments)) {
                const momentRef = doc(situationRef, 'moments', key);
                await setDoc(momentRef, { description: value }, { merge: true });
            }
        }

        return new Response(JSON.stringify({ "data": scenarioId }), { status: 200 });
    } catch (error) {
        console.error("Error saving story:", error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}

// export const POST = async ({ request }) => {
//     const body = await request.json();
    
//     const { scenarioId, scenario, situations } : StoryStruct = body;

//     console.log(scenarioId, scenario, situations);

//     try {
//         // Create a query against the 'scenario' collection for documents that have the 'scenarioId' field matching 'scenarioId' from the request
//         const scenariosCollectionRef = collection(db, 'scenario');
//         const q = query(scenariosCollectionRef, where("scenarioId", "==", scenarioId));

//         // Execute the query
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//             console.log("This scenario already exists");

//             const docRef = querySnapshot.docs[0].ref;

//             await updateDoc(docRef, { 'title': scenario, 'image': '', });
//         } else {
//             console.log("This is a new scenario");
//             // No document with the scenarioId exists, create a new document
//             const docRef = await addDoc(scenariosCollectionRef, { scenarioId: scenarioId, 'title': scenario, 'image': '' });
//             console.log("Document written with ID:", docRef.id);
//         }

//         return new Response(JSON.stringify({ "data": scenarioId }), { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
//     }
// }