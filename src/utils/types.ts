export type MomentObject = {
    [key: string]: string;
}

type Moment = {
    moment: string
}

type Situation = {
    title: string,
    moments: Moment[]
}

export type StoryStruct = {
    scenario: string,
    situations: Situation[],
    moments: string
}