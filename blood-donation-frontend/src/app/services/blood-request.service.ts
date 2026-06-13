import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

export interface BloodRequest {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  patientName: string;
  bloodGroup: string;
  quantity: number;
  reason: string;
  hospital: string;
  urgency: 'normal' | 'urgent' | 'critical';
  requiredDate: string;
  contactPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBloodRequest {
  patientName: string;
  bloodGroup: string;
  quantity: number;
  reason: string;
  hospital: string;
  urgency: 'normal' | 'urgent' | 'critical';
  requiredDate: string;
  contactPhone: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BloodRequestService {
  private apiUrl = 'http://localhost:5000/api/blood-requests';

  constructor(private http: HttpClient, private auth: Auth) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      ...this.auth.getAuthHeaders(),
      'Content-Type': 'application/json'
    });
  }

  // Create a new blood request
  createBloodRequest(request: CreateBloodRequest): Observable<BloodRequest> {
    return this.http.post<BloodRequest>(this.apiUrl, request, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user's blood requests
  getUserRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/my-requests`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get all blood requests (admin only)
  getAllRequests(filters?: {
    status?: string;
    urgency?: string;
    bloodGroup?: string;
  }): Observable<BloodRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.bloodGroup) params.append('bloodGroup', filters.bloodGroup);

    return this.http.get<BloodRequest[]>(`${this.apiUrl}?${params.toString()}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get matching requests for donors
  getMatchingRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/matching`, {
      headers: this.getAuthHeaders()
    });
  }

  // Approve blood request (admin only)
  approveRequest(id: string, notes?: string): Observable<BloodRequest> {
    return this.http.patch<BloodRequest>(`${this.apiUrl}/${id}/approve`, 
      { notes }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Reject blood request (admin only)
  rejectRequest(id: string, rejectionReason: string): Observable<BloodRequest> {
    return this.http.patch<BloodRequest>(`${this.apiUrl}/${id}/reject`, 
      { rejectionReason }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Complete blood request (admin only)
  completeRequest(id: string): Observable<BloodRequest> {
    return this.http.patch<BloodRequest>(`${this.apiUrl}/${id}/complete`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Get blood request statistics
  getStatistics(): Observable<{
    statusStats: Array<{ _id: string; count: number }>;
    urgencyStats: Array<{ _id: string; count: number }>;
    bloodGroupStats: Array<{ _id: string; count: number }>;
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders()
    });
  }
}
