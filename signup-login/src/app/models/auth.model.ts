export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    activeSince?: string;
    role: 'user' | 'admin';
}