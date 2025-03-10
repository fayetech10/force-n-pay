export interface Mission {
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
      utilisateur: {
            id: number;
      };
}
