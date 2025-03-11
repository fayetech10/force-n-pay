import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Mission } from "../interfaces/Mission";
import { Router } from "@angular/router";
import { AuthServiceConfig } from "./AuthServiceConfig";

@Injectable({
    providedIn: "root"
})
export class MissionService {
    private API = environment.apiUrl;
    private baseUrl = '/api'; // Vérifiez que cette URL correspond à votre configuration réelle

    constructor(
        private http: HttpClient,
        private authconfig: AuthServiceConfig
    ) { }

    // Récupère toutes les missions
    getMissions(): Observable<Mission[]> {
        return this.http.get<Mission[]>(
            `${this.baseUrl}/forc-n/v1/mission`,
            { headers: this.authconfig.createAuthHeaders() }
        ).pipe(catchError(this.authconfig.handleError));
    }

    // Ajoute une nouvelle mission
    addMission(mission: Mission): Observable<Mission> {
        return this.http.post<Mission>(
            `${this.baseUrl}/forc-n/v1/mission/add`,
            mission,
            { headers: this.authconfig.createAuthHeaders() }
        ).pipe(catchError(this.authconfig.handleError));
    }

    // Met à jour une mission existante
    updateMission(mission: Mission): Observable<Mission> {
        return this.http.put<Mission>(
            `${this.baseUrl}/forc-n/v1/mission/update/${mission.id}`,
            mission,
            { headers: this.authconfig.createAuthHeaders() } // Ajout des headers manquants
        ).pipe(catchError(this.authconfig.handleError));
    }

    // Supprimer une mission
    deleteMission(missionId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/forc-n/v1/mission/${missionId}`, { headers: this.authconfig.createAuthHeaders() }).pipe(
            catchError(this.authconfig.handleError),
        )
    }

  
}