import type { Scenario } from "../routes/scenario/data";

export type FirestoreData = {
    scenarios: Array<StoryStruct>;
};

export type MomentObject = {
    [key: string]: string;
}

type Situation = {
    id: string,
    title: string,
    image: { situationImage: string, momentImages: MomentImage[] },
    situationSort: number,
    moments: Array<Moment>
}

export type Moment = {
    id: number,
    image: string,
    textOptions: Array<string>,
    momentImageDescriptionResponse: string,
    momentDescription: string,
    momentSummarization: string
};

type MomentImage = {
    image: string,
    title: string,
    moment: string
}

export type StoryStruct = {
    story: string,
    setting: string,
    character: string,
    scenarioId: string,
    scenario: string,
    summary: string,
    image: string,
    situations: Situation[],
    moments: string,
    isFinish: boolean
}

export const emptyStoryStruct: StoryStruct = {
    story: '',
    setting: '',
    character: '',
    scenarioId: '',
    scenario: '',
    summary: '',
    image: '',
    situations: [],
    moments: '',
    isFinish: false,
}