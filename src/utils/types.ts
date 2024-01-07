import type { Scenario } from "../routes/scenario/data";

export type FirestoreData = {
    scenarios: Array<Scenario>;
};

export type MomentObject = {
    [key: string]: string;
}

type Situation = {
    id: string,
    title: string,
    image: string,
    moments: MomentObject
}

export type StoryStruct = {
    scenarioId: string,
    scenario: string,
    image: string,
    situations: Situation[],
    moments: string
}