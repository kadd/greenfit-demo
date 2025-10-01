
export interface ImpressumSection {
    heading: string;
    text: string;
}

export interface Impressum {
    isPage: boolean;
    title: string;
    description: string;
    sections: ImpressumSection[];
}