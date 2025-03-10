import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Mission } from "../interfaces/Mission";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class MissionService {
    private API = environment.apiUrl;
    private baseUrl = '/api'; // Vérifiez que cette URL correspond à votre configuration réelle

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    // Récupère toutes les missions
    getMissions(): Observable<Mission[]> {
        return this.http.get<Mission[]>(
            `${this.baseUrl}/forc-n/v1/mission`,
            { headers: this.createAuthHeaders() }
        ).pipe(catchError(this.handleError));
    }

    // Ajoute une nouvelle mission
    addMission(mission: Mission): Observable<Mission> {
        return this.http.post<Mission>(
            `${this.baseUrl}/forc-n/v1/mission/add`,
            mission,
            { headers: this.createAuthHeaders() }
        ).pipe(catchError(this.handleError));
    }

    // Met à jour une mission existante
    updateMission(mission: Mission): Observable<Mission> {
        return this.http.put<Mission>(
            `${this.baseUrl}/forc-n/v1/mission/update/${mission.id}`,
            mission,
            { headers: this.createAuthHeaders() } // Ajout des headers manquants
        ).pipe(catchError(this.handleError));
    }

    private createAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        if (!token) {
            this.handleMissingToken();
            throw new Error('Token non disponible'); // Arrête l'exécution
        }

        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    private getToken(): string | null {
        return sessionStorage.getItem("token");
    }

    private handleMissingToken(): void {
        console.error('Session expirée ou non authentifié');
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Une erreur est survenue';

        if (error.status === 403) {
            errorMessage = 'Accès refusé - Veuillez vous reconnecter';
            this.handleMissingToken();
        } else if (error.error instanceof ErrorEvent) {
            console.error('Err  eur client:', error.error.message);
        } else {
            console.error(`Erreur serveur ${error.status}: ${error.message}`);
        }

        return throwError(() => new Error(errorMessage));
    }
}