export type FirestoreData = {
    scenarios: Array<{
        id: string;
        image: string;
        title: string;
    }>;
};

export type MomentObject = {
    [key: string]: string;
}

type Moment = {
    moment: string
}

type Situation = {
    id: string,
    title: string,
    moments: Moment[]
}

export type StoryStruct = {
    scenarioId: string,
    scenario: string,
    situations: Situation[],
    moments: string
}