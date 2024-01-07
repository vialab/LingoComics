import { db } from "$lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function load({ params }) {

    const scenarioId = params.scenario;

    try {
        const scenarioRef = doc(db, 'scenario', scenarioId);

        // fetch document
        const docSnapshot = await getDoc(scenarioRef);

        if (docSnapshot.exists()) {
            // if document exists then return its data
            const scenario = {
                id: docSnapshot.id,
                ...docSnapshot.data()
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