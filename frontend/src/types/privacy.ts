
export interface PrivacySection {
    id?: string;
    heading: string;
    text: string;
}

export interface Privacy { 
    id?: string;
    updatedAt?: string;
    isPage: boolean;
    title: string;
    sections: PrivacySection[];
}