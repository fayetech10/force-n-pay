export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    avatar?: string;
}