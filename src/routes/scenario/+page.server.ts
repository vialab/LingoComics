import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

export async function load() {
    try {
        const baseScenarios = ['1', '2', '3', '4', '5'];

        // read from scenario collection
        const scenarioCollection = collection(db, 'scenario');

        // query to fetch documents with specific IDs
        const scenarioPromises = baseScenarios.map(id => {
            const docRef = doc(scenarioCollection, id);
            return getDoc(docRef);
        });

        // resolve the promises
        const scenariosDocs = await Promise.all(scenarioPromises);

        // process documents
        const scenarios = scenariosDocs.map(docSnapshot => {
            if (docSnapshot.exists()) {
                return {
                    id: docSnapshot.id,
                    ...docSnapshot.data()
                };
            } else {
                console.log(`No document was found with ID ${docSnapshot.id}`);
                return null;
            }
        }).filter(scenario => scenario !== null);

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
