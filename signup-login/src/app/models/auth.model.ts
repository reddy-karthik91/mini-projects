export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    activeSince?: string; // Add this line to store the date when the user became active
    isActive: boolean; // Add this line to fix the NG9 error
    role: 'user' | 'admin';
    profilePic?: string;
}