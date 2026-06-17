import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DataStorageService } from './data-storage.service';

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    bloodType?: string;
    phone?: string;
  };
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    bloodType?: string;
    phone?: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'https://blood-donation-f1uf.onrender.com/api';

  constructor(
    private http: HttpClient,
    public dataStorage: DataStorageService
  ) { }

  // ----------------- REGISTER -----------------
  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role);
          this.dataStorage.setCurrentUser(response.user);
        }
      })
    );
  }

  // ----------------- LOGIN -----------------
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setToken(response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role);
          this.dataStorage.setCurrentUser(response.user);
        }
      })
    );
  }

  // ----------------- LOGOUT -----------------
  logout() {
    this.dataStorage.logout();
    this.removeToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
  }

  // ----------------- LOGIN STATUS -----------------
  isLoggedIn(): boolean {
    return this.getToken() !== null && this.dataStorage.isLoggedIn();
  }

  getCurrentUser() {
    let user = this.dataStorage.getCurrentUser();
    if (!user) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        user = JSON.parse(storedUser);
        this.dataStorage.setCurrentUser(user);
      }
    }
    return user;
  }

  // ----------------- TOKEN MANAGEMENT -----------------
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // ----------------- AUTH HEADERS -----------------
  getAuthHeaders(): { Authorization: string } {
    const token = this.getToken();
    return { Authorization: `Bearer ${token}` };
  }
}