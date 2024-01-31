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
    situationSort: number,
    moments: string[]
}

export type StoryStruct = {
    character: string,
    scenarioId: string,
    scenario: string,
    image: string,
    situations: Situation[],
    moments: string
}