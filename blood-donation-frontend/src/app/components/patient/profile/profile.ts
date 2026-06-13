import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
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
    this.userData = {};
    this.editData = {};
    this.loadPatientData();
  }

  loadPatientData() {
    const currentUser = this.auth.getCurrentUser();
    console.log('Current user from auth:', currentUser);

    this.http.get('http://localhost:5000/api/test/users')
      .subscribe({
        next: (response: any) => {
          if (response && response.data && response.data.length > 0) {
            const patients = response.data.filter((user: any) => user.role === 'patient');

            if (patients.length > 0) {
              let selectedPatient = null;

              // Try to find the patient that matches the logged-in user
              if (currentUser && currentUser.email) {
                selectedPatient = patients.find((patient: any) =>
                  patient.email === currentUser.email
                );
              }

              // If no matching patient found, use the first one
              if (!selectedPatient) {
                selectedPatient = patients[0];
                console.log('No matching patient found, using first patient');
              } else {
                console.log('Found matching patient for logged-in user');
              }

              this.userData = Object.assign({}, selectedPatient);
              console.log('Using patient:', this.userData);
              this.cdr.detectChanges();
            } else {
              // Fallback test data
              this.userData = {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Test',
                lastName: 'Patient',
                email: 'test@test.com',
                phone: '1234567890',
                bloodType: 'A+',
                dateOfBirth: '1990-01-01',
                role: 'patient'
              };
            }
          }
        },
        error: (error) => {
          // Fallback test data
          this.userData = {
            _id: '507f1f77bcf86cd799439011',
            firstName: 'Test',
            lastName: 'Patient',
            email: 'test@test.com',
            phone: '1234567890',
            bloodType: 'A+',
            dateOfBirth: '1990-01-01',
            role: 'patient'
          };
        }
      });
  }

  loadUserData() {
    console.log('=== LOADING PATIENT PROFILE ===');
    this.loading = true;
    this.error = '';

    const token = localStorage.getItem('patientToken');
    console.log('Token found:', !!token);

    if (!token) {
      console.log('No token found');
      this.error = 'Please login to view your profile.';
      this.loading = false;
      return;
    }

    console.log('Making API call to get patients...');

    // Use the working endpoint to get all users and find the patient
    this.http.get('http://localhost:5000/api/test/users')
      .subscribe({
        next: (response: any) => {
          console.log('✅ API Response:', response);
          if (response && response.data) {
            // Find the patient user
            const patient = response.data.find((user: any) => user.role === 'patient');
            console.log('Found patient:', patient);

            if (patient) {
              this.userData = patient;
              console.log('✅ Patient data loaded:', this.userData);
            } else {
              console.log('❌ No patient found in users list');
              this.error = 'No patient found in database';
            }
          } else {
            console.log('❌ No users found');
            this.error = 'No users found in database';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ API Error:', error);
          this.error = 'Failed to load profile data';
          this.loading = false;
        }
      });
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

    // Try to save without authentication
    this.http.put(`http://localhost:5000/api/users/${this.userData._id}`, updateData)
      .subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.userData = response.data;
            this.auth.dataStorage.setCurrentUser(response.data);
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
