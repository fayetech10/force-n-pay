import { Mission } from "./Mission";
import { Seance } from "./Seance";

// Si certaines propriétés sont optionnelles dans l'interface :
export interface Activity {
    id?: number;
    name: string;
    date?: string;
    missionId?: number;
    paiement?:  null;
    seance?: Seance | null;
    rapport?:  null;
}