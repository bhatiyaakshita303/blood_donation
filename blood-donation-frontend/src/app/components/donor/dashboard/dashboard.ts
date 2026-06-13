import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userData: any = {};
  bloodStocks: any[] = [];
  donations: any[] = [];
  error = '';
  stats = {
    totalDonations: 0,
    lastDonation: 'Never',
    bloodType: 'Unknown',
    upcomingAppointments: 0
  };

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userData = user;
    }
    this.loadBloodStocks(); // load stock automatically
    this.loadDonationHistory();
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
  loadDonationHistory() {

    const token = this.auth.getToken();

    this.http.get('http://localhost:5000/api/requests/donor-history', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((res: any) => {
      console.log("API RESPONSE:", res);
      this.donations = res;

    });

  }

  getTotalUnits() {
    return this.bloodStocks.reduce((total: number, stock: any) => {
      return total + stock.units;
    }, 0);
  }

  loadDonorData() {
    this.error = '';

    // Get current logged-in user from auth service
    const currentUser = this.auth.getCurrentUser();
    console.log('Current user from auth:', currentUser);

    // Always get user data from API to ensure we have a real database user
    this.http.get('http://localhost:5000/api/test/users')
      .subscribe({
        next: (response: any) => {
          if (response && response.data && response.data.length > 0) {
            const donors = response.data.filter((user: any) => user.role === 'donor');

            if (donors.length > 0) {
              let selectedDonor = null;

              // Try to find the donor that matches the logged-in user
              if (currentUser && currentUser.email) {
                selectedDonor = donors.find((donor: any) =>
                  donor.email === currentUser.email
                );
              }

              // If no matching donor found, use the first one
              if (!selectedDonor) {
                selectedDonor = donors[0];
                console.log('No matching donor found, using first donor');
              } else {
                console.log('Found matching donor for logged-in user');
              }

              this.userData = Object.assign({}, selectedDonor);
              this.calculateStats();
              console.log('Using donor:', this.userData);
              this.cdr.detectChanges();
            } else {
              this.error = 'No donor accounts found';
            }
          }
        },
        error: (error) => {
          console.error('Error loading donor data:', error);
          this.error = 'Failed to load donor data';
        }
      });
  }

  calculateStats() {
    // Calculate mock stats based on user data
    this.stats = {
      totalDonations: Math.floor(Math.random() * 10) + 1, // Random 1-10 donations
      lastDonation: this.userData.lastDonation || '2 months ago',
      bloodType: this.userData.bloodType || 'O+',
      upcomingAppointments: Math.floor(Math.random() * 3) // Random 0-2 appointments
    };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
