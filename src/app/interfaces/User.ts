export interface User {
nombreSeanceFaits: any;
    actif: boolean;
    avatar: any;
    id: number;
    nom: string;
    prenom: string;
    username?: string | null;
    email: string;
    password?: string | null;
    telephone: string;
    adress: string;
    dateNaissance: string | Date;
    iban?: string | null;
    qualifications: string[];
    hourlyRate: number;
    roles: string[];
    lastActivity: Date
}
