import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceConfig } from "./AuthServiceConfig";
import { User } from "../interfaces/User";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class MentorService {
    constructor(
        private http: HttpClient,
        private authServiceConf: AuthServiceConfig
    ) { }

    private baseUrl = "/api"
    addMentor(mentor: User): Observable<User> {
        const headers = this.authServiceConf.createAuthHeaders()
        return this.http.post<User>(`${this.baseUrl}/forc-n/v1/user/add`, mentor, { headers }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }
}