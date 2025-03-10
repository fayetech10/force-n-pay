// auth.interceptor.ts
import { HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = sessionStorage.getItem('token'); // Récupérer le token
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}

// Utilisez cette fonction wrapper
