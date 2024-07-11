import { db } from '$lib/firebase/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
// import { GOOGLE_API_KEY } from '$env/static/private';

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