import { db } from "$lib/firebase/firebase";
import type { RequestHandler } from "@sveltejs/kit";
import type { MomentObject } from "../../../../utils/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const GET: RequestHandler = async ({ params }) => {
    const { scenarioId } = params;

    const storyCollectionRef = collection(db, 'scenario');
    const docRef = doc(storyCollectionRef, scenarioId);
    try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const storyData = docSnapshot.data();
            return new Response(JSON.stringify({ story: storyData }), { status: 200 });
        } else {
            // story does not exist
            return new Response(JSON.stringify({ error: `No story with id ${scenarioId}` }));
        }
    } catch (error) {
        return new Response(JSON.stringify({ "error": "error retrieving story" }), { status: 500 });
    }    
}