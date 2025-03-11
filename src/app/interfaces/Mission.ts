import { User } from "./User";

export interface Mission {
priority: any;
echeance: string|number|Date;
lastProgressUpdate: string|number|Date;
kpis: any;
lastUpdate: string|number|Date;
      id: number;
      name: string;
      type: string;
      description: string;
      status_paiement: string;
      status_mission: string;
      objectif: string;
      dateDebut: string;
      dateFin: string;
      budget: number;
      progress: number;
      utilisateur: User
}
