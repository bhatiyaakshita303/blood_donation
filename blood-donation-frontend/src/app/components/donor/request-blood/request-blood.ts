import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-blood',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-blood.html',
  styleUrls: ['./request-blood.css']
})
export class RequestBlood implements OnInit {

  userData: any = {};
  requests: any[] = [];
  error = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.userData = currentUser;
      this.loadBloodRequests();
    }
  }

  // Load matching blood requests
  loadBloodRequests() {
    const token = this.auth.getToken();
    this.loading = true;
    this.http.get('https://blood-donation-f1uf.onrender.com/api/blood-requests/matching', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.requests = res.data || [];
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to load blood requests';
        this.loading = false;
      }
    });
  }

  // Respond to a blood request
  willingToDonate(request: any) {
    const token = this.auth.getToken();

    this.http.patch(
      `https://blood-donation-f1uf.onrender.com/api/blood-requests/${request._id}/respond`,
      { donorId: this.userData._id },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(() => {
      alert('You have responded to this request!');
      this.loadBloodRequests();
    }, err => console.error(err));
  }

  // Logout
  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // Sidebar navigation
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}