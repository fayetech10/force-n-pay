import { User } from "./User";

export interface ContactItem {
    icon: string;
    type: 'text' | 'link';
    getContent: (user: User) => string;
    getAriaLabel: (user: User) => string;
    getLink?: (user: User) => string;
}