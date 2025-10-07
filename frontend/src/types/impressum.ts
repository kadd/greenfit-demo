
export interface ImpressumSection {
    id?: string;
    key: string;
    heading: string;
    text: string;
}

export interface Impressum {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    isPage: boolean;
    title: string;
    description: string;
    company: string;
    address: string;
    email: string;
    phone: string;
    sections: ImpressumSection[];
}