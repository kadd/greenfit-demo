import { NavigationItem } from "./navigation";

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
    navigation: NavigationItem[];
}

export default HeaderData;