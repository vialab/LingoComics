import { db } from "$lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load() {
    try {
        const scenarioCollection = collection(db, 'scenario');

        const snapshot = await getDocs(scenarioCollection);

        const scenarios = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        console.log('scenarios', scenarios);

        return {
            scenarios
        }
    } catch (error) {
        console.error(error);
        return {
            scenarios: []
        }
    }
}