import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { UserService, User } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './donor-list.html',
  styleUrl: './donor-list.css',
})
export class DonorList implements OnInit {
  donors: User[] = [];
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
    console.log('=== DONOR LIST COMPONENT INIT ===');
    console.log('Component initialized!');
    
    // Force immediate data loading
    this.forceLoadData();
  }

  forceLoadData() {
    console.log('🔄 Force loading data...');
    
    // Clear everything
    this.donors = [];
    this.error = '';
    
    // Load data immediately
    this.loadDonorsSimple();
    
    // Force UI update
    this.cdr.detectChanges();
    
    // Backup approach
    setTimeout(() => {
      this.loadDonorsSimple();
      this.cdr.detectChanges();
    }, 200);
  }

  loadDonorsSimple() {
    console.log('🔄 Simple donor loading...');
    
    // Clear data
    this.donors = [];
    this.error = '';
    
    // Simple fetch without async/await
    fetch('http://localhost:5000/api/users/role/donor?limit=10')
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
          this.donors = data.data;
          console.log('✅ Donors loaded:', this.donors.length);
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

  loadData() {
    console.log('loadData() called - loading donors...');
    
    this.error = '';
    this.donors = []; // Clear array for fresh data

    // Direct HTTP call - no loading state
    this.http.get('http://localhost:5000/api/users/role/donor?limit=10').subscribe({
      next: (response: any) => {
        console.log('✅ Raw response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        
        if (response && response.data) {
          this.donors = response.data; // Set real data
          this.hasMore = response.data.length === 10;
          console.log('✅ Donors set from response.data:', this.donors.length);
          console.log('Donors array:', this.donors);
        } else if (response) {
          this.donors = response; // Set real data
          this.hasMore = response.length === 10;
          console.log('✅ Donors set from response:', this.donors.length);
          console.log('Donors array:', this.donors);
        } else {
          console.error('❌ No data in response');
          this.error = 'No data received from server';
        }
        
        console.log('Final donors array length:', this.donors.length);
        console.log('Final donors array:', this.donors);
      },
      error: (error: any) => {
        console.error('❌ HTTP Error:', error);
        this.error = 'Failed to connect to server';
      }
    });
  }

  loadMoreDonors() {
    if (!this.loading && this.hasMore) {
      this.currentPage++;
      this.loadData(); // Call the working loadData method
    }
  }

  searchDonors() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.userService.searchUsers(this.searchTerm, 'donor').subscribe({
        next: (response) => {
          this.donors = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search donors. Please try again.';
          this.loading = false;
          console.error('Search donors error:', error);
        }
      });
    } else {
      // If search is cleared, reload initial data
      this.loadData();
    }
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.loadData(); // Call loadData instead of loadDonors
    }
  }

  toggleUserStatus(donor: User) {
    this.userService.toggleUserStatus(donor._id).subscribe({
      next: (response) => {
        // Update the donor in the local array
        const index = this.donors.findIndex(d => d._id === donor._id);
        if (index !== -1) {
          this.donors[index] = response.data;
        }
      },
      error: (error) => {
        console.error('Toggle donor status error:', error);
        // Show error message (you could add a toast notification here)
      }
    });
  }

  deleteDonor(donor: User) {
    if (confirm(`Are you sure you want to delete donor ${this.userService.getDisplayName(donor)}?`)) {
      this.userService.deleteUser(donor._id).subscribe({
        next: () => {
          // Remove donor from local array
          this.donors = this.donors.filter(d => d._id !== donor._id);
        },
        error: (error) => {
          console.error('Delete donor error:', error);
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
  getDisplayName(donor: User): string {
    return this.userService.getDisplayName(donor);
  }

  getUserStatus(donor: User): string {
    return this.userService.getUserStatus(donor);
  }

  getUserStatusClass(donor: User): string {
    return this.userService.getUserStatusClass(donor);
  }

  isUserActive(donor: User): boolean {
    return this.userService.isUserActive(donor);
  }
}
