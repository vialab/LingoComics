export type Scenario = {
    id: string,
    image: string;
    title: string;
    situations: Array<Situation>;
}

export type Situation = {
    id: number,
    image: string;
    title: string;
    moments: Array<Moment>
}

export type Moment = {
    id: number,
    image: string,
    textOptions: Array<string>,
    momentImageDescriptionResponse: string,
    momentDescription: string
};
