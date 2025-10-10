export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    isActive: boolean;
    icon?: string;
    children?: NavigationItem[]; // für Dropdown-Menüs
    external?: boolean; // für externe Links
}

export default NavigationItem;