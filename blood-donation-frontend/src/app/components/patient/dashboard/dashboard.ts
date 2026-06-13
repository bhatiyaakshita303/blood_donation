import { Component, OnInit, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userData: any = {};
  bloodStocks: any[] = [];
  error = '';
  requestHistory: any[] = [];
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const user = this.auth.getCurrentUser();

    if (user) {
      const token = this.auth.getToken();

      this.http.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe((res: any) => {
        this.userData = res.data;
        console.log("FULL USER DATA:", this.userData);
      });
    }

    this.loadBloodStocks();
    this.loadUserProfile();
  }

  loadBloodStocks() {
    const token = this.auth.getToken();
    this.http.get('http://localhost:5000/api/blood', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.bloodStocks = res.data || [];
      },
      error: (err) => {
        console.error("Error loading blood stocks", err);
      }
    });

  }

  loadUserProfile() {

    const token = this.auth.getToken();

    this.http.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {

        console.log("PROFILE DATA:", res.data);

        this.userData = res.data;

      },
      error: (err) => {
        console.error("Profile load error", err);
      }
    });

  }

  getTotalUnits() {
    return this.bloodStocks.reduce((total: number, stock: any) => {
      return total + stock.units;
    }, 0);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
