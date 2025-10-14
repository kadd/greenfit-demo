export interface NavigationData {
    categories: NavigationCategory[];
    settings: NavigationSettings;
}

export interface NavigationSettings {
    showIcons: boolean;
    layout: "horizontal" | "vertical";
    mobileBreakpoint: number;
    maxDepth?: number;           // Maximale Verschachtelungstiefe
    collapsible?: boolean;       // Können Kategorien eingeklappt werden?
}

export interface NavigationCategory {
    id: string;
    label: string;
    items: Record<string, NavigationItem>;
    order?: number;              // Reihenfolge der Kategorien
    visible?: boolean;           // Kategorie sichtbar?
}

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    isActive: boolean;
    icon?: string;
    children?: Record<string, NavigationItem>; // Konsistent mit items
    external?: boolean;
    isButton?: boolean;
    order?: number;              // Reihenfolge innerhalb Kategorie
    description?: string;        // Tooltip/Beschreibung
    badge?: string;             // Badge-Text (z.B. "Neu", "Beta")
    target?: "_blank" | "_self"; // Link-Ziel
}