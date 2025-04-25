import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Seance } from "../interfaces/Seance";
import { AuthServiceConfig } from "./AuthServiceConfig";
import { Cohorte } from "../interfaces/Cohorte";

@Injectable({
    providedIn: "root"
})

export class SeanceService {
    constructor(
        private readonly http: HttpClient,
        private readonly authServiceConf: AuthServiceConfig
    ) { }

    private baseAp = "/api"
    getAllSeance(): Observable<Seance[]> {
        return this.http.get<Seance[]>(`${this.baseAp}/forc-n/v1/seance`, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }

    getSeanceByUserId(userId: number): Observable<Seance[]> {
        return this.http.get<Seance[]>(`${this.baseAp}/forc-n/v1/seance/user/${userId}`, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err: HttpErrorResponse) => {
                const errMessage = err.error?.error || "Erreur lors du chargement des  seances"
                return throwError(() => new Error(errMessage))
            })
        )
    }

    getCohortes(): Observable<Cohorte[]> {
        return this.http.get<Cohorte[]>(`${this.baseAp}/force-n/v1/cohort`,
            { headers: this.authServiceConf.createAuthHeaders() }).pipe(
                catchError(err => this.authServiceConf.handleError(err))
            )
    }
    addSeance(seance: Seance): Observable<Seance> {
        return this.http.post<Seance>(`${this.baseAp}/forc-n/v1/seance/add`,
            seance, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
                catchError((err: HttpErrorResponse) => {
                    const errMessage = err.error?.error || "Erreur s'est produite"
                    return throwError(() => new Error(errMessage))
                })
            )
    }

    updateSeance(seance: Seance): Observable<Seance> {
        return this.http.put<Seance>(`${this.baseAp}/forc-n/v1/seance/update/${seance.id}`, seance, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }

    getTotalHour(userId: number): Observable<any> {
        return this.http.get<any>(`${this.baseAp}/forc-n/v1/seance/user/getHourTotal/${userId}`,
            { headers: this.authServiceConf.createAuthHeaders() }).pipe(
                catchError((err) => this.authServiceConf.handleError(err))
            )
    }
}