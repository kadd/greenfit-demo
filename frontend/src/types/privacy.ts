
export interface PrivacySection {
    heading: string;
    text: string;
}

export interface Privacy { 
    isPage: boolean;
    title: string;
    sections: PrivacySection[];
}