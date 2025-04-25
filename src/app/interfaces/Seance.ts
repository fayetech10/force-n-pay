import { Cohorte } from "./Cohorte";
import { User } from "./User";

export interface Seance {
    id: number | null,
    heureDebut: string | undefined;
    heureFin: string | undefined;
    date: Date | null | undefined;
    activite: string | undefined;
    heuresTotaux: string ;
    cohorte: Cohorte;
    utilisateur: User;
}