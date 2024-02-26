export type Scenario = {
    id: string,
    image: string;
    title: string;
    situations: Array<Situation>;
}

export type Situation = {
    id: string,
    image: { situationImage: string, momentImages: MomentImage[] };
    title: string;
    moments: Array<Moment>;
}

type MomentImage = {
    image: string,
    title: string,
    moment: string
}

export type Moment = {
    id: number,
    image: string,
    textOptions: Array<string>,
    momentImageDescriptionResponse: string,
    momentDescription: string,
    momentSummarization: string
};
