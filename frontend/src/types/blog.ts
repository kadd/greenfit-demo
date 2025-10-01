export interface BlogItem {
    id: string;
    title: string;
    date: string;
    excerpt: string;
}
export interface Blog {
    id?: string;
    isPage: boolean;
    title: string;
    description: string;
    items?: BlogItem[];
}   