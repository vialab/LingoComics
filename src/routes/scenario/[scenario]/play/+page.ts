import { db } from '$lib/firebase/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import type { StoryStruct } from '../../../../utils/types.js';

export async function load({ params, fetch }) {
    const scenarioId = params.scenario;
    try {
        const response = await fetch(`/api/scenario/${scenarioId}`, {
            method: "GET"
        });

        const result = await response.json();

        const scenario = result as StoryStruct;

        
        return { scenario }
    } catch (error) {
        console.error(error);
        return { scenario: {} }
    }
}