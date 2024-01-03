export type Scenario = {
    id: number,
    image: string;
    title: string;
    situation: Array<Situation>;
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
    textOptions: Array<string>
};
