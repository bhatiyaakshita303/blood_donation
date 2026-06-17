import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-list.html',
  styleUrls: ['./request-list.css']
})
export class RequestList implements OnInit {

  requests: any[] = [];
  error = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    const token = this.auth.getToken();
    this.http.get('https://blood-donation-f1uf.onrender.com/api/blood-requests', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => this.requests = res.data || [],
      error: () => this.error = 'Failed to load requests'
    });
  }

  markCompleted(id: string) {

    this.http.patch(`https://blood-donation-f1uf.onrender.com/api/requests/${id}`, {
      status: 'completed'
    }).subscribe({
      next: (res: any) => {
        alert("Donation completed successfully");
        this.loadRequests();
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  approveRequest(request: any) {
    const token = this.auth.getToken();
    this.http.patch(`https://blood-donation-f1uf.onrender.com/api/blood-requests/${request._id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(() => this.loadRequests());
  }

  rejectRequest(request: any) {
    const token = this.auth.getToken();
    this.http.patch(`https://blood-donation-f1uf.onrender.com/api/blood-requests/${request._id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(() => this.loadRequests());
  }

  completeRequest(request: any) {
    const token = this.auth.getToken();
    this.http.patch(`https://blood-donation-f1uf.onrender.com/api/blood-requests/${request._id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(() => this.loadRequests());
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}