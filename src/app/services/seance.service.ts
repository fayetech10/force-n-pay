import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { Seance } from "../interfaces/Seance";
import { AuthServiceConfig } from "./AuthServiceConfig";

@Injectable({
    providedIn: "root"
})

export class SeanceService {
    constructor(
        private readonly http: HttpClient,
        private readonly authServiceConf: AuthServiceConfig
    ) { }

    private baseAp = "api"
    getAllSeance(): Observable<Seance[]> {
        return this.http.get<Seance[]>(`${this.baseAp}/forc-n/v1/seance`, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }
}