export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    author_id: string;
    created_at: string;
    updated_at: string;
    user?: User;
}
