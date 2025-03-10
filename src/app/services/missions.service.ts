import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Mission } from "../interfaces/Mission";

@Injectable({
    providedIn: "root"
})
export class MissionService {
    private API = environment.apiUrl;
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    // Méthode pour récupérer les missions
    getMission(): Observable<Mission[]> {
        const headers = this.createAuthHeaders();
        return this.http.get<Mission[]>(`${this.baseUrl}/forc-n/v1/mission`, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    
    // Création des en-têtes d'authentification
    private createAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        if (!token) {
            console.error('Token non disponible');
            // Vous pourriez rediriger l'utilisateur vers la page de connexion ici
        }
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Récupère le token depuis le sessionStorage
    private getToken(): string | null {
        return sessionStorage.getItem("token");
    }

    // Méthode pour gérer les erreurs
    private handleError(error: HttpErrorResponse) {
        // Log des erreurs côté client et serveur
        if (error.error instanceof ErrorEvent) {
            console.error('Erreur côté client:', error.error.message);
        } else {
            console.error(`Erreur côté serveur. Code d'erreur ${error.status}, Message: ${error.message}`);
        }

        // Log l'erreur côté serveur (optionnel, peut être utile pour le suivi)
        // Vous pouvez envoyer l'erreur à un service de journalisation si nécessaire

        // Retourne un message d'erreur générique
        return throwError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
}
