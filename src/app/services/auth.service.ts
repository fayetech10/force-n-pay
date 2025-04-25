import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../interfaces/User';
import { AuthResponse } from '../interfaces/AuthResponse';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthServiceConfig } from './AuthServiceConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;
  private baseUrl = '/api'

  constructor(
    private authServiceConf: AuthServiceConfig, private router: Router, private http: HttpClient) {
    // Initialise l'utilisateur au démarrage si token valide
    const token = this.getToken();
    if (token) {
      try {
        const user = jwtDecode<User>(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        this.saveToken(res.token); // Sauvegarde le token
        const user = jwtDecode<User>(res.token); // Décode le token pour obtenir l'utilisateur
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue s’est produite';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = "Impossible de se connecter au serveur.";
    } else if (error.status === 401) {
      errorMessage = "Identifiants incorrects ou session expirée.";
    } else if (error.status === 500) {
      errorMessage = "Erreur interne du serveur.";
    }

    return throwError(() => ({ message: errorMessage }));
  }
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }



  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<User>(token);
    } catch (error) {
      console.error('Token invalide:', error);
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return (decoded.exp as number) > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.currentUserSubject.next(null);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  updatePassword(oldPassword: string, newPassword: string, confirmationPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/updatePassword`, { oldPassword, newPassword, confirmationPassword }, {
      headers: this.authServiceConf.createAuthHeaders()
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.error || 'Erreur inconnue'
        return throwError(() => new Error(errorMessage))
      })
    )
  }
  updateUser(userId: number, passwordUpdated: boolean): Observable<User> {
    const body = {passwordUpdated}
    return this.http.put<User>(`${this.baseUrl}/forc-n/v1/user/update/updated/${userId}`, body, { headers: this.authServiceConf.createAuthHeaders() }).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.error || "Erreur lors de la mise à jour du statut"
        return throwError(() => new Error(errorMessage))
      })
    )
  }
}