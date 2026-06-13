import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-history.html',
  styleUrls: ['./request-history.css']
})
export class RequestHistory implements OnInit {

  userData: any = {};
  requestHistory: any[] = [];
  error = '';
  loading = false;
  processing = false; 

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.userData = currentUser;
      this.loadPatientRequests();
    }
  }

  loadPatientRequests() {
    const token = this.auth.getToken();
    this.loading = true;
    this.http.get('http://localhost:5000/api/blood-requests/my-requests', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.requestHistory = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load requests';
        this.loading = false;
      }
    });
  }

  contactDonor(id: string) {

    if (this.processing) return;

    this.processing = true;

    const token = this.auth.getToken();

    this.http.patch(
      `http://localhost:5000/api/requests/contact-donor/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        alert("Donor contacted successfully");
        this.processing = false;
        this.loadPatientRequests();
      },
      error: (err) => {
        console.error(err);
        this.processing = false;
      }
    });
  }

  confirmDonation(id: string) {

    if (this.processing) return;

    this.processing = true;

    const token = this.auth.getToken();

    this.http.patch(
      `http://localhost:5000/api/requests/donation-done/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: () => {
        alert("Donation marked as completed");
        this.processing = false;
        this.loadPatientRequests();
      },
      error: (err) => {
        console.error(err);
        this.processing = false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // <-- ADD THIS METHOD
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}