import { db } from "$lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { StoryStruct } from "../../../utils/types.js";

export async function load({ params }) {

    const scenarioId = params.scenario;

    try {
        const scenarioRef = doc(db, 'scenario', scenarioId);

        // fetch document
        const docSnapshot = await getDoc(scenarioRef);

        if (docSnapshot.exists()) {
            // if document exists then return its data
            const scenario: StoryStruct = {
                scenarioId: docSnapshot.id,
                ...(docSnapshot.data() as Omit<StoryStruct, 'scenarioId'>)
            }

            return { scenario };
        } else {
            return { error: 'Document not found' };
        }
    } catch (error) {
        console.error(error);
        return;
    }
}