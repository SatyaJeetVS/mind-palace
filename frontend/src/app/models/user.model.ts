export interface User {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    bookmarks: string[];
}

export interface UserCreate {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

export interface UserUpdate {
    email?: string;
    username?: string;
    full_name?: string;
    password?: string;
} 