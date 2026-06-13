import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor-profile.html',
  styleUrl: './donor-profile.css',
})
export class DonorProfile implements OnInit {
  userData: any = {};
  isEditing = false;
  editData: any = {};
  error = '';
  success = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Clear previous data and load fresh data
    this.userData = {};
    this.editData = {};
    this.loadDonorData();
  }

  loadDonorData() {
    const currentUser = this.auth.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Use logged-in user directly
    this.userData = { ...currentUser };
    this.cdr.detectChanges();
  }

  startEdit() {
    this.isEditing = true;
    this.editData = { ...this.userData };
    this.error = '';
    this.success = '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.editData = {};
    this.error = '';
    this.success = '';
  }

  saveProfile() {
    this.error = '';
    this.success = '';

    if (!this.userData || !this.userData._id) {
      this.error = 'Cannot save profile: User data not loaded';
      return;
    }

    // Remove sensitive fields that shouldn't be updated
    const updateData = { ...this.editData };
    delete updateData.password;
    delete updateData.role;
    delete updateData.isActive;

    this.http.put(`http://localhost:5000/api/users/${this.userData._id}`, updateData)
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.userData = response.data;
            this.success = 'Profile updated successfully!';
            this.isEditing = false;
            this.editData = {};
          } else {
            this.error = 'Profile update failed: No data returned';
          }
        },
        error: (error) => {
          this.error = 'Failed to update profile. Please try again.';
        }
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
