//import { NavigationItem } from "./navigation";

export interface HeaderData {
    title: string;
    subtitle: string;
    cta: {
        label: string;
        href: string;
    };
    logoSrc?: string;
    logoAlt?: string;
    backgroundImage?: string;
    backgroundAlt?: string;
    //avigation: NavigationItem[];
}

export default HeaderData;

// Example of a default header data
export const defaultHeaderData: HeaderData = {
    title: "Willkommen bei Unserer Webseite",
    subtitle: "Ihr Partner für großartige Lösungen",
    cta: {
        label: "Kontaktieren Sie uns",
        href: "/contact"
    },
    logoSrc: "/logo.png",
    logoAlt: "Logo",
    backgroundImage: "/header-bg.jpg",
    backgroundAlt: "Header Hintergrund",
    //navigation: []
};

