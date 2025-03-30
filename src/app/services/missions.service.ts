import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, Observable, throwError } from "rxjs";
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

    //Mise a jours de la progrsseion de la missiom
    updateMissionProgression(mission: Mission): Observable<Mission> {

        if (!mission?.id) {
            return throwError(() => new Error("Id de mission Invalide"))
        }
        const updatePayLoadMission = {
            progress: mission.progress
        }
        return this.http.patch<Mission>(`${this.baseUrl}/forc-n/v1/mission/update/progressMission/${mission.id}`, updatePayLoadMission, { headers: this.authconfig.createAuthHeaders() }).pipe(
            catchError((err) => this.authconfig.handleError(err))
        )
    }

    // Supprimer une mission
    deleteMission(missionId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/forc-n/v1/mission/${missionId}`, { headers: this.authconfig.createAuthHeaders() }).pipe(
            catchError(this.authconfig.handleError),
        )
    }
    // recuperer les mission par rapport a leurs utilisateurs
    getMissionByUserId(id: number): Observable<Mission[]> {
        return this.http.get<Mission[]>(`${this.baseUrl}/forc-n/v1/mission/user/${id}`, { headers: this.authconfig.createAuthHeaders() }).pipe(
            catchError((err) => this.authconfig.handleError(err)),

        )
    }

}