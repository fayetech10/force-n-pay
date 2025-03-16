import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, throwError } from "rxjs";
import { User } from "../interfaces/User";
import { Router } from "@angular/router";
import { AuthServiceConfig } from "./AuthServiceConfig";
import { JsonPatchOperation } from "../interfaces/JsonPatchOperation";

@Injectable({
    providedIn: "root"
})

export class UserService {
    createUser(userData: User) {
        return this.http.post<User>(`${this.baseUrl}/forc-n/user/add`, userData, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }
    private userSubjects = new BehaviorSubject<User[]>([])
    users$ = this.userSubjects.asObservable()

    getAllQualifications() {
        throw new Error('Method not implemented.');
    }
    getAllRoles() {
        throw new Error('Method not implemented.');
    }
    constructor(private http: HttpClient, private readonly router: Router,
        private readonly authServiceConf: AuthServiceConfig
    ) { }

    private baseUrl = '/api'

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/forc-n/v1/users`, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError(err => this.authServiceConf.handleError(err))
        )
    }

    refreshUsers(): void {
        this.http.get<User[]>(`${this.baseUrl}/forc-n/v1/users`)
            .subscribe(users => this.userSubjects.next(users));
    }

    deleteUser(id: number): Observable<void> {
        const url = `${this.baseUrl}/forc-n/v1/users/${id}`;
        const headers = this.authServiceConf.createAuthHeaders();

        return this.http.delete<void>(url, { headers }).pipe(
            catchError(err => this.authServiceConf.handleError(err))
        );
    }


    updateUser(id: number, operations: JsonPatchOperation[]) {
        return this.http.patch<User>(`${this.baseUrl}/forc-n/v1/user/update/${id}`, operations, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }

    updateActif(id: number, operations: JsonPatchOperation[]) {
        return this.http.patch<User>(
            `${this.baseUrl}/forc-n/v1/user/update/actif/${id}`,
            operations,
            { headers: this.authServiceConf.createAuthHeaders() }
        ).pipe(
            catchError(err => this.authServiceConf.handleError(err))
        );
    }

    addUser(userData: User): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/forc-n/v1/user/add`, userData, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
            catchError((err) => this.authServiceConf.handleError(err))
        )
    }


}