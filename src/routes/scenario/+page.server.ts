import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

export async function load() {
    try {
        // read from scenario collection
        const scenarioCollection = collection(db, 'scenario');
        
        // fetch documents from collection
        const snapshot = await getDocs(scenarioCollection);

        // process documents
        const scenarios = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        console.log(scenarios);

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