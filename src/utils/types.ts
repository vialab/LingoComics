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
    moments: MomentObject
}

export type StoryStruct = {
    scenarioId: string,
    scenario: string,
    situations: Situation[],
    moments: string
}