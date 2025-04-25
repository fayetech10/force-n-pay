import { Mission } from "./Mission";
import { Seance } from "./Seance";

// Si certaines propriétés sont optionnelles dans l'interface :
export interface Activity {
    id?: number;
    name: string;
    date: Date;
    mission?: Mission;
    paiement?:  null;
    seance?: Seance | null;
    rapport?:  null;
}