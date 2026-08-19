import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';

  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

  /** Mensaje que se mostrará en el login después de una expiración automática. */
  sessionExpiredMessage: string | null = null;

  constructor() {
    const token = this.getToken();
    if (token) {
      this.scheduleSessionExpiration(token);
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.scheduleSessionExpiration(response.token);
        }
      })
    );
  }

  logout(): void {
    this.clearSessionExpirationTimer();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión por expiración o token inválido.
   * Establece un mensaje para que el login lo muestre.
   */
  handleSessionExpiration(): void {
    this.sessionExpiredMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
    this.logout();
  }

  /**
   * Programa el cierre de sesión automático cuando el JWT expire.
   */
  private scheduleSessionExpiration(token: string): void {
    this.clearSessionExpirationTimer();

    const expiresAt = this.getTokenExpiration(token);

    if (expiresAt === null) {
      return;
    }

    const timeoutMs = expiresAt - Date.now();

    if (timeoutMs > 0) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.handleSessionExpiration();
      }, timeoutMs);
    } else {
      this.handleSessionExpiration();
    }
  }

  private clearSessionExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      if (payload && typeof payload.exp === 'number') {
        return payload.exp * 1000;
      }

      return null;
    } catch {
      return null;
    }
  }
}