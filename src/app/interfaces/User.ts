export interface User {
    actif: any;
    avatar: any;
    id: number;
    nom: string;
    prenom: string;
    username?: string | null;
    email: string;
    password?: string | null;
    telephone: string;
    adresse: string;
    dateNaissance: string | Date;
    rib?: string | null;
    qualifications: string[];
    tauxRemuneration: number;
    role: string[];
}
