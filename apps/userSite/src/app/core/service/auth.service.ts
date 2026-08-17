import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  AuthResponse,
  MessageResponse,
  RefreshTokenResponse,
  RegisterResponse,
  User,
} from '../interface/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private apiUrl = environment.apiUrl;

  // State for the current user
  currentUser = signal<User | null>(null);

  register(data: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/users/register`, data);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login/`, credentials).pipe(
      tap((response) => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
        this.currentUser.set(response.user);
      }),
    );
  }

  verifyEmail(email: string, otp: string, storeSlug: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/users/verify-email/`, {
      email,
      otp,
      storeSlug,
    });
  }

  resendVerification(email: string, storeSlug: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/resend-verification/`, { email, storeSlug });
  }

  forgotPassword(email: string, storeSlug: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/users/forgot-password/`, {
      email,
      storeSlug,
    });
  }

  resetPassword(data: any): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/users/reset-password/`, data);
  }

  changePassword(data: any): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.apiUrl}/users/change-password`, data);
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.http
      .post<RefreshTokenResponse>(`${this.apiUrl}/users/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
        }),
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}
