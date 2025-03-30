import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { AuthServiceConfig } from "./AuthServiceConfig";

@Injectable({
    providedIn: "root"
})

export class RapportService {
    constructor(private http: HttpClient, private authServiceConf: AuthServiceConfig) { }
    private baseUrl = "/api"

    uploadRapport(file: File, titre: string, missionId: number): Observable<any> {
        const dataForm: FormData = new FormData()
        dataForm.append('file', file)
        dataForm.append('titre', titre)
        dataForm.append('mission_id', missionId.toString())

        const headers = this.authServiceConf.createFilehHeader()
        return this.http.post<any>(`${this.baseUrl}/file/upload`, dataForm, { headers }
        ).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }

    getRapportByMissionId(missionId: number): Observable<any> {
        const headers = this.authServiceConf.createFilehHeader()
        return this.http.get<any>(`${this.baseUrl}/file/rapports/mission/${missionId}`, { headers }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }

}