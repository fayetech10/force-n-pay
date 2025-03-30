import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthServiceConfig {
    constructor(private router: Router) { }

    createAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        if (!token) {
            this.handleMissingToken();
            throw new Error('Token non disponible');
        }

        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
    createFilehHeader(): HttpHeaders {
        const token = this.getToken();
        if (!token) {
            this.handleMissingToken();
            throw new Error('Token non disponible');
        }

        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getToken(): string | null {
        return sessionStorage.getItem("token");
    }

    handleMissingToken(): void {
        console.error('Session expirée ou non authentifié');
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Une erreur est survenue';

        if (error.status === 403) {
            errorMessage = 'Accès refusé - Veuillez vous reconnecter';
            // this.handleMissingToken();
        } else if (error.error instanceof ErrorEvent) {
            console.error('Erreur client:', error.error.message);
        } else {
            console.error(`Erreur serveur ${error.status}: ${error.message}`);
        }

        return throwError(() => new Error(errorMessage));
    }
}
