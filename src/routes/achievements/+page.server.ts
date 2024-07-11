import { db } from "$lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load() {
    try {
        // read from scenario collection
        const scenarioCollection = collection(db, 'scenario');

         // get documents for scenario collection
        const snapshot = await getDocs(scenarioCollection);

        // store only scenarios with achievements object
        const scenarios = snapshot.docs
            .filter(doc => doc.data().achievements)
            .map(doc => doc.data());

        return {
            scenarios
        }
    } catch (error) {
        console.error('Error: ', error);
        return {
            scenarios: []
        }
    }
}