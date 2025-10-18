// frontend/src/types/blog.ts

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  date: string;
  tags?: string[];
  published: boolean;
  featuredImage?: string;
  categories?: string[];
  commentsEnabled: boolean;
  comments: Comment[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  items: BlogPost[];
  createdAt: string;
  updatedAt: string;
}