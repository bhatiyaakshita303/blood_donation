import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BloodService } from '../../../services/blood.service';

export interface BloodStock {
  _id: string;
  bloodType: string;
  units: number;
  lastUpdated: string;
  status: string;
}

@Component({
  selector: 'app-blood-stock',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './blood-stock.html',
  styleUrl: './blood-stock.css',
})
export class BloodStock implements OnInit {
  bloodStocks: BloodStock[] = [];
  error = '';
  searchTerm = '';
  newBloodType = '';
  newUnits = 0;

  constructor(
    private bloodService: BloodService,
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('=== BLOOD STOCK COMPONENT INIT ===');
    this.loadBloodStocks();
  }

  loadBloodStocks() {
    console.log('Loading blood stocks...');
    this.error = '';

    this.http.get<any>('http://localhost:5000/api/blood').subscribe({
      next: (response) => {
        console.log('Blood stocks response:', response);
        if (response && response.data) {
          this.bloodStocks = response.data;
          console.log(' Blood stocks loaded:', this.bloodStocks.length);
        } else {
          console.error(' No blood stock data');
          this.error = 'No blood stock data received';
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
        this.error = 'Failed to load blood stocks';
      }
    });
  }

  updateBloodStock(stock: BloodStock) {

    const token = localStorage.getItem('adminToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.put(
      `http://localhost:5000/api/blood/${stock._id}`,
      {
        bloodType: stock.bloodType,
        units: stock.units,
        lastUpdated: new Date().toISOString()
      },
      { headers }
    ).subscribe({
      next: (response) => {
        console.log("Updated successfully");
        this.loadBloodStocks();
      },
      error: (error) => {
        console.error("Update error:", error);
      }
    });
  }

  deleteBloodStock(stock: BloodStock) {

    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.delete(
      `http://localhost:5000/api/blood/${stock._id}`,
      { headers }
    ).subscribe({
      next: (response) => {
        console.log("Deleted successfully");
        this.loadBloodStocks();
      },
      error: (error) => {
        console.error("Delete error:", error);
      }
    });
  }

  addBloodStock() {
    console.log(' Adding new blood stock...');
    console.log('Form data:', {
      bloodType: this.newBloodType,
      units: this.newUnits
    });

    if (!this.newBloodType || !this.newUnits || this.newUnits <= 0) {
      console.error(' Invalid form data');
      this.error = 'Please select blood type and enter valid units';
      return;
    }

    this.error = '';

    this.http.post<any>('http://localhost:5000/api/blood', {
      bloodType: this.newBloodType,
      units: this.newUnits,
      lastUpdated: new Date().toISOString()
    }).subscribe({
      next: (response) => {
        console.log(' Blood stock added:', response);
        if (response && response.data) {
          this.bloodStocks.push(response.data);
          // Reset form
          this.newBloodType = '';
          this.newUnits = 0;
        }
      },
      error: (error) => {
        console.error(' Add error:', error);
        this.error = `Failed to add blood stock: ${error.message || error.statusText || 'Unknown error'}`;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  // Helper methods
  getTotalUnits(): number {
    return this.bloodStocks.reduce((total, stock) => total + stock.units, 0);
  }

  getBloodTypes(): string[] {
    return [...new Set(this.bloodStocks.map(s => s.bloodType))];
  }

  getStocksByType(bloodType: string): BloodStock[] {
    return this.bloodStocks.filter(stock => stock.bloodType === bloodType);
  }

  isLowStock(bloodType: string, threshold: number = 10): boolean {
    const stocks = this.getStocksByType(bloodType);
    const totalUnits = stocks.reduce((total, stock) => total + stock.units, 0);
    return totalUnits < threshold;
  }

  getStockStatusClass(stock: BloodStock): string {
    if (this.isLowStock(stock.bloodType)) {
      return 'status-critical';
    } else if (stock.units === 0) {
      return 'status-empty';
    } else if (stock.units < 5) {
      return 'status-low';
    }
    return 'status-normal';
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.loadBloodStocks();
    }
  }

  searchBloodStocks() {
    if (this.searchTerm.trim()) {
      // Filter blood stocks by search term
      const allStocks = [...this.bloodStocks]; // This would be loaded from API
      this.bloodStocks = allStocks.filter(stock =>
        stock.bloodType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stock.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadBloodStocks();
    }
  }

  editStock(stock: BloodStock) {
    const newUnits = prompt("Enter new units", stock.units.toString());
    const newBloodType = prompt("Enter new blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)", stock.bloodType);

    if (newUnits && newBloodType) {
      // Validate blood type
      const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      if (validBloodTypes.includes(newBloodType)) {
        stock.units = Number(newUnits);
        stock.bloodType = newBloodType;
        this.updateBloodStock(stock);
      } else {
        alert("Invalid blood type. Please use: A+, A-, B+, B-, AB+, AB-, O+, O-");
      }
    }
  }

  deleteStock(stock: BloodStock) {
    this.deleteBloodStock(stock);
  }

}

