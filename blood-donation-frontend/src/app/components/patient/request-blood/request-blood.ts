import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { BloodRequestService, CreateBloodRequest } from '../../../services/blood-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-request-blood',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './request-blood.html',
  styleUrl: './request-blood.css',
})
export class RequestBlood implements OnInit {
  userData: any = {};
  isEditing = false;
  editData: any = {};
  error = '';
  success = '';
  loading = false;

  requestForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private bloodRequestService: BloodRequestService,
    private fb: FormBuilder
  ) {
    this.requestForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(2)]],
      bloodGroup: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      hospital: ['', [Validators.required, Validators.minLength(3)]],
      urgency: ['normal', Validators.required],
      requiredDate: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9+\-\s()]+$')]],
      notes: ['']
    });
  }
  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userData = user;
    }
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.markFormGroupTouched(this.requestForm);
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    const formData = this.requestForm.value;

    // Format the date
    const formattedDate = new Date(formData.requiredDate).toISOString();

    const bloodRequest: CreateBloodRequest = {
      patientName: formData.patientName,
      bloodGroup: formData.bloodGroup,
      quantity: formData.quantity,
      reason: formData.reason,
      hospital: formData.hospital,
      urgency: formData.urgency,
      requiredDate: formattedDate,
      contactPhone: formData.contactPhone,
      notes: formData.notes || undefined
    };

    this.bloodRequestService.createBloodRequest(bloodRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.requestForm.reset();

        // Show success message and redirect after 3 seconds
        setTimeout(() => {
          this.navigateTo('/patient/request-history');
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.error?.message || 'Failed to submit blood request. Please try again.';
        console.error('Blood request submission error:', error);
      }
    });
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters for form validation
  get f() {
    return this.requestForm.controls;
  }

  // Set minimum date to today
  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
