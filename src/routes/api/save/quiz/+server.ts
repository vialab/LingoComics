import { db } from '$lib/firebase/firebase.js';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../../utils/types.js';

export const POST = async ({ request }) => {
    const body = await request.json();

    let points : number = body.points;
    let story : StoryStruct = body.scenario;

    try {
        const docRef = doc(db, 'scenario', story.scenarioId);
        const now = new Date().toISOString();

        await updateDoc(docRef, {
            'achievements': arrayUnion({
                points: points,
                timestamp: now
            })
        });

        return new Response(JSON.stringify({ "data": "quiz results saved" }), { status: 200 });
    } catch (error) {
        console.error("Error saving quiz results:", error);
        return new Response(JSON.stringify({ "data": "error saving quiz results" }), { status: 500 });
    }
}