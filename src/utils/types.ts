export interface DragPair {
    draggable: HTMLElement,
    target: HTMLElement
}

export interface TouchDraggableOptions {
    addPair: (pair: DragPair) => void;
    removePair: (pair: DragPair) => void;
    isDragging: boolean;
    handleSwap?: (pair1: DragPair, pair2: DragPair) => void;
    resetIncorrectPairs?: () => void;
    resetFunction?: () => void;
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
    keywords: Record<string, string>,
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

type Achievement = {
    points: number,
    timestamp: string
}

export type StoryStruct = {
    story: string,
    achievements: Achievement[],
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
    achievements: [],
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

export type Scene = {
    narrative: string,
    nextStep: string,
    options: string[],
    moment: Moment[],
    keywordsObject: Record<string, string>,
    image: ""
}

export const defaultScene: Scene = {
    narrative: "",
    nextStep: "",
    moment: [],
    options: [],
    keywordsObject: {},
    image: ""
}

export const emptyMoment: Moment = {
    momentId: "",
    image: "",
    keywords: {},
    textOptions: [],
    momentImageDescriptionResponse: "",
    momentDescription: "",
    momentSummarization: ""
}