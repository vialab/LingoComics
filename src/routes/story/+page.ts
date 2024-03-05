import { db } from "$lib/firebase/firebase";
import { collection, getDocs, where } from "firebase/firestore";

export async function load() {
    try {
        const scenarioCollection = collection(db, 'scenario');

        const snapshot = await getDocs(scenarioCollection);

        const scenarios = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        }).filter(scenario => !['1', '2', '3', '4', '5'].includes(scenario.id));

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