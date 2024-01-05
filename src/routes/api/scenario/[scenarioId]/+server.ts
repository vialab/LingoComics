import { db } from "$lib/firebase/firebase";
import type { RequestHandler } from "@sveltejs/kit";
import type { MomentObject } from "../../../../utils/types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const GET: RequestHandler = async ({ params }) => {
    const { scenarioId } = params;

    try {
        // get collection reference for 'scenario'
        const scenarioCollectionRef = collection(db, 'scenario');
        const scenarioDocRef = doc(scenarioCollectionRef, scenarioId);

        // get the document data
        const scenarioSnapshot = await getDoc(scenarioDocRef);
        const scenarioData = scenarioSnapshot.data();

        // return if scenario does not exist
        if (!scenarioSnapshot.exists()) {
            return new Response(JSON.stringify({ "data": "Scenario not found" }), { status: 404 });
        }

        // get situation collection
        const situationsCollectionRef = collection(scenarioDocRef, 'situations');
        const situationsSnapshot = await getDocs(situationsCollectionRef);

        // parse situations
        const situations = [];
        for (const situationDoc of situationsSnapshot.docs) {
            const situationData = situationDoc.data();

            // get moment collection
            const momentsCollectionRef = collection(situationDoc.ref, 'moments');
            const momentsSnapshot = await getDocs(momentsCollectionRef);

            const moments : MomentObject = {};
            momentsSnapshot.forEach(momentDoc => {
                const momentData = momentDoc.data();
                console.log(momentData);
                moments[momentDoc.id] = momentData.description;
            });

            situations.push({
                id: situationDoc.id,
                title: situationData.title,
                moments: moments
            });
        }

        const responseData = {
            scenarioId: scenarioId,
            scenario: scenarioData!.title,
            situations: situations
        };

        console.log(responseData);

        return new Response(JSON.stringify(responseData), { status: 200 });    
    } catch (error) {
        return new Response(JSON.stringify({ "error": "error retrieving story" }), { status: 500 });
    }    
}