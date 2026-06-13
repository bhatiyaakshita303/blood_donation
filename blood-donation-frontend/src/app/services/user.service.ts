import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { Auth } from './auth';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'donor' | 'patient' | 'admin';
  bloodType?: string;
  age?: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  roleStats: Array<{ _id: string; count: number }>;
  bloodTypeStats: Array<{ _id: string; count: number }>;
  recentUsers: User[];
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient, private auth: Auth) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      ...this.auth.getAuthHeaders(),
      'Content-Type': 'application/json'
    });
  }

  // Get users by role
  getUsersByRole(role: 'donor' | 'patient' | 'admin', page: number = 1, limit: number = 20): Observable<UserListResponse> {
    console.log('=== USER SERVICE DEBUG ===');
    console.log('Getting users by role:', role);
    console.log('API URL:', `${this.apiUrl}/role/${role}?page=${page}&limit=${limit}`);
    console.log('Auth headers:', this.getAuthHeaders());
    
    const request = this.http.get<UserListResponse>(`${this.apiUrl}/role/${role}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    // Subscribe to see what happens
    return new Observable<UserListResponse>((observer: Observer<UserListResponse>) => {
      request.subscribe({
        next: (response) => {
          console.log('✅ HTTP Request Success:', response);
          observer.next(response);
        },
        error: (error) => {
          console.error('❌ HTTP Request Error:', error);
          console.error('Error status:', error.status);
          console.error('Error text:', error.statusText);
          console.error('Error URL:', error.url);
          console.error('Full error:', error);
          observer.error(error);
        },
        complete: () => {
          console.log('🏁 HTTP Request Complete');
          observer.complete();
        }
      });
    });
  }

  // Get all users with filtering and pagination
  getAllUsers(filters?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<UserListResponse> {
    const params = new URLSearchParams();
    if (filters?.role && filters.role !== 'all') params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return this.http.get<UserListResponse>(`${this.apiUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user by ID
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update user
  updateUser(id: string, updates: Partial<User>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, updates, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete user
  deleteUser(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user statistics
  getUserStats(): Observable<{ success: boolean; data: UserStats }> {
    return this.http.get<{ success: boolean; data: UserStats }>(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  // Toggle user active status
  toggleUserStatus(id: string): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.apiUrl}/${id}/toggle-status`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Helper methods for specific roles
  getDonors(page: number = 1, limit: number = 10): Observable<UserListResponse> {
    console.log('=== USER SERVICE getDonors CALLED ===');
    console.log('Calling getUsersByRole with donor, page:', page, 'limit:', limit);
    return this.getUsersByRole('donor', page, limit);
  }

  getPatients(page: number = 1, limit: number = 10): Observable<UserListResponse> {
    return this.getUsersByRole('patient', page, limit);
  }

  getAdmins(page: number = 1, limit: number = 10): Observable<UserListResponse> {
    return this.getUsersByRole('admin', page, limit);
  }

  // Search users
  searchUsers(query: string, role?: string): Observable<UserListResponse> {
    return this.getAllUsers({ search: query, role });
  }

  // Get user display name
  getDisplayName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  // Get user role display
  getRoleDisplay(role: string): string {
    const roleMap = {
      donor: 'Donor',
      patient: 'Patient',
      admin: 'Administrator'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  }

  // Check if user is active
  isUserActive(user: User): boolean {
    return user.isActive !== false; // Default to true if not set
  }

  // Get user status text
  getUserStatus(user: User): string {
    return this.isUserActive(user) ? 'Active' : 'Inactive';
  }

  // Get user status color class
  getUserStatusClass(user: User): string {
    return this.isUserActive(user) ? 'status-active' : 'status-inactive';
  }
}
