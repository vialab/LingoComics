import { db } from '$lib/firebase/firebase.js';
import { doc, updateDoc } from 'firebase/firestore';

export const POST = async ({ request }) => {
    const body = await request.json();
    
    const { scenario, scenes } = body;
    
    try {
        const docRef = doc(db, 'scenario', scenario.scenarioId);
        await updateDoc(docRef, { scenes });

        return new Response(JSON.stringify({ "data": "story successfully saved" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error saving story" }), { status: 500 });
    }
}