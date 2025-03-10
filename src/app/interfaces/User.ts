export interface User {
    id: number;
    nom: string;
    prenom: string;
    username?: string | null;
    email: string;
    password?: string | null;
    telephone: string;
    adresse: string;
    dateNaissance?: string | null;
    rib?: string | null;
    qualifications: string[];
    tauxRemuneration: number;
    role: string[];
}
