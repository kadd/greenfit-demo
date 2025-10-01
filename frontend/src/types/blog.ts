export interface BlogItem {
    title: string;
    date: string;
    excerpt: string;
}
export interface Blog {
    isPage: boolean;
    title: string;
    description: string;
    items?: BlogItem[];
}   