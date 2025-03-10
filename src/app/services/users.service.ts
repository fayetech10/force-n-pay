import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { User } from "../interfaces/User";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class UserService {
    constructor(private http: HttpClient, private readonly router: Router) { }

    private baseUrl = '/api'

    getAllUsers(): Observable<User[]> {

        return this.http.get<User[]>(`${this.baseUrl}/forc-n/v1/users`, { headers: this.createAuthHeaders() }).pipe(
            catchError(this.handleError)
        )
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

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Une erreur est survenue';

        if (error.status === 403) {
            errorMessage = 'Accès refusé - Veuillez vous reconnecter';
            this.handleMissingToken();
        } else if (error.error instanceof ErrorEvent) {
            console.error('Err eur client:', error.error.message);
        } else {
            console.error(`Erreur serveur ${error.status}: ${error.message}`);
        }

        return throwError(() => new Error(errorMessage));
    }

    private getToken(): string | null {
        return sessionStorage.getItem("token");
    }

    private handleMissingToken(): void {
        console.error('Session expirée ou non authentifié');
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }
}