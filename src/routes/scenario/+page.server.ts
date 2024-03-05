import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

export async function load() {
    try {
        // read from scenario collection
        const scenarioCollection = collection(db, 'scenario');

        const q = query(scenarioCollection, where("isFinish", "==", true));
        
        // fetch documents from collection
        const snapshot = await getDocs(q);

        // process documents
        const scenarios = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        // return data
        return {
            scenarios
        }
    } catch (error) {
        console.error('Error: ', error);
        return {
            scenarios: []
        };
    }
}