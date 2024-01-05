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
        // existing scenario
        if (!querySnapshot.empty) {
            console.log("This scenario already exists");
            scenarioDocRef = querySnapshot.docs[0].ref;

            await updateDoc(scenarioDocRef, { 'title': scenario, 'image': '' });
            console.log("updating document with id:", scenarioDocRef.id);
        // new scenario
        } else {
            console.log("This is a new scenario");
            scenarioDocRef = doc(scenariosCollectionRef, scenarioId);

            await setDoc(scenarioDocRef, { scenarioId: scenarioId, 'title': scenario, 'image': '' });
            console.log("Document created with ID:", scenarioDocRef.id);
        }

        // Process situations
        for (const situation of situations) {
            const situationId = situation.id; // Use a unique identifier for the situation
            const situationRef = doc(scenarioDocRef, 'situations', situationId);
        
            // Check if the situation exists
            const situationSnapshot = await getDoc(situationRef);
            if (situationSnapshot.exists()) {
                // Update existing situation
                await updateDoc(situationRef, { title: situation.title });
            } else {
                // Create new situation
                await setDoc(situationRef, { id: situationId, title: situation.title });
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