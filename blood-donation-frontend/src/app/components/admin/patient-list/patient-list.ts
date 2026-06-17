import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { UserService, User } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientList implements OnInit {
  patients: User[] = [];
  loading = false; // Always false - no loading
  error = '';
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  hasMore = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('=== PATIENT LIST COMPONENT INIT ===');
    console.log('Component initialized!');
    
    // Force immediate data loading
    this.forceLoadData();
  }

  forceLoadData() {
    console.log('🔄 Force loading patient data...');
    
    // Clear everything
    this.patients = [];
    this.error = '';
    
    // Load data immediately
    this.loadPatientsSimple();
    
    // Force UI update
    this.cdr.detectChanges();
    
    // Backup approach
    setTimeout(() => {
      this.loadPatientsSimple();
      this.cdr.detectChanges();
    }, 200);
  }

  loadPatientsSimple() {
    console.log('🔄 Simple patient loading...');
    
    // Clear data
    this.patients = [];
    this.error = '';
    
    // Simple fetch without async/await
    fetch('https://blood-donation-f1uf.onrender.com/api/users/role/patient?limit=10')
      .then(response => {
        console.log('✅ Response received:', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      })
      .then(data => {
        console.log('✅ Data received:', data);
        if (data && data.data) {
          this.patients = data.data;
          console.log('✅ Patients loaded:', this.patients.length);
          // Force UI update
          this.cdr.detectChanges();
        } else {
          console.error('❌ No data in response');
          this.error = 'No data received from server';
          this.cdr.detectChanges();
        }
      })
      .catch(error => {
        console.error('❌ Fetch error:', error);
        this.error = 'Failed to connect to server';
      });
  }

  loadMorePatients() {
    if (!this.loading && this.hasMore) {
      this.currentPage++;
      this.loadPatientsSimple(); // Use the working method
    }
  }

  searchPatients() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.userService.searchUsers(this.searchTerm, 'patient').subscribe({
        next: (response) => {
          this.patients = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search patients. Please try again.';
          this.loading = false;
          console.error('Search patients error:', error);
        }
      });
    } else {
      this.loadPatientsSimple(); // Use the working method
    }
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.loadPatientsSimple(); // Use the working method
    }
  }

  toggleUserStatus(patient: User) {
    this.userService.toggleUserStatus(patient._id).subscribe({
      next: (response) => {
        // Update the patient in the local array
        const index = this.patients.findIndex(p => p._id === patient._id);
        if (index !== -1) {
          this.patients[index] = response.data;
        }
      },
      error: (error) => {
        console.error('Toggle patient status error:', error);
        // Show error message (you could add a toast notification here)
      }
    });
  }

  deletePatient(patient: User) {
    if (confirm(`Are you sure you want to delete patient ${this.userService.getDisplayName(patient)}?`)) {
      this.userService.deleteUser(patient._id).subscribe({
        next: () => {
          // Remove patient from local array
          this.patients = this.patients.filter(p => p._id !== patient._id);
        },
        error: (error) => {
          console.error('Delete patient error:', error);
          // Show error message
        }
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // Helper methods
  getDisplayName(patient: User): string {
    return this.userService.getDisplayName(patient);
  }

  getUserStatus(patient: User): string {
    return this.userService.getUserStatus(patient);
  }

  getUserStatusClass(patient: User): string {
    return this.userService.getUserStatusClass(patient);
  }

  isUserActive(patient: User): boolean {
    return this.userService.isUserActive(patient);
  }

  getPatientAge(patient: User): string {
    return patient.age ? `${patient.age} years` : 'N/A';
  }

  getPatientBloodType(patient: User): string {
    return patient.bloodType || 'N/A';
  }
}
