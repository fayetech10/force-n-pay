export interface Mission{
 
     id: number;
      name: string;
      description: string;
      status: 'En cours' | 'Terminée' | 'En attente';
      assignee: string;
      startDate: string | null;
      endDate: string | null;
}