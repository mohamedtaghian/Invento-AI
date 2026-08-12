import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private cookieService = inject(CookieService);
  
  private readonly ACCESS_TOKEN_KEY = 'invento_access_token';
  private readonly REFRESH_TOKEN_KEY = 'invento_refresh_token';

  setTokens(accessToken: string, refreshToken: string): void {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, accessToken, 15, '/');
    this.cookieService.set(this.REFRESH_TOKEN_KEY, refreshToken, 15, '/');
  }

  getAccessToken(): string {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return this.cookieService.get(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/');
    this.cookieService.delete(this.REFRESH_TOKEN_KEY, '/');
  }

  hasToken(): boolean {
    return this.cookieService.check(this.ACCESS_TOKEN_KEY);
  }
}
