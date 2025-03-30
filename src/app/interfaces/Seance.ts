import { Cohorte } from "./Cohorte";
import { User } from "./User";

export interface Seance {
    heureDebut: string;
    heureFin: string;
    date: string;
    activite: string;
    heuresTotaux: string;
    cohorte: Cohorte;
    utilisateur: User;
}