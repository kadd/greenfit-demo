
export interface PrivacySection {
    id?: string;
    heading: string;
    text: string;
}

export interface Privacy { 
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    isPage: boolean;
    title: string;
    sections: PrivacySection[];
}