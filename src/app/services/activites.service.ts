import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceConfig } from "./AuthServiceConfig";
import { catchError, Observable } from "rxjs";
import { Activity } from "../interfaces/Actiites";

@Injectable({
    providedIn: "root"
})

export class ActivitesService {
    constructor(
        private auhtServiceConf: AuthServiceConfig,
        private http: HttpClient) { }


    private baseUrl = '/api'
    getAllActivity(): Observable<Activity[]> {
        return this.http.get<Activity[]>(`${this.baseUrl}/forc-n/v1/activtes`,
            { headers: this.auhtServiceConf.createAuthHeaders() }).pipe(
                catchError((err) => this.auhtServiceConf.handleError(err))
            )
    }


    addActivity(activity: Activity): Observable<Activity> {
        return this.http.post<Activity>(`${this.baseUrl}/forc-n/v1/activtes/add`, activity, { headers: this.auhtServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.auhtServiceConf.handleError(err))
        )
    }

}