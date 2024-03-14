export interface DragPair {
    draggable: HTMLElement,
    target: HTMLElement
}

export interface TouchDraggableOptions {
    addPair: (pair: DragPair) => void;
    removePair: (pair: DragPair) => void;
    resetIncorrectPairs?: () => void;
}

export type FirestoreData = {
    scenarios: Array<StoryStruct>;
};

export type MomentObject = {
    [key: string]: string;
}

export type Situation = {
    id: string,
    title: string,
    image: { situationImage: string, momentImages: MomentImage[] },
    situationSort: number,
    moments: Array<Moment>
}

export type Moment = {
    momentId: string,
    image: string,
    textOptions: Array<string>,
    momentImageDescriptionResponse: string,
    momentDescription: string,
    momentSummarization: string
};

type MomentImage = {
    momentId: string,
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