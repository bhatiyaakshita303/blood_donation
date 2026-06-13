import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[\\d\\s\\-\\(\\)\\+]{10,}$')]],
    dateOfBirth: ['', Validators.required],
    bloodType: ['', Validators.required],
    role: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    agreeTerms: [false, Validators.requiredTrue],
    receiveNotifications: [false]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onRegister() {
    console.log('Form validity:', this.registerForm.valid);
    console.log('Form errors:', this.registerForm.errors);
    console.log('Form values:', this.registerForm.value);
    
    if (this.registerForm.valid) {
      const { confirmPassword, agreeTerms, ...formData } = this.registerForm.value;
      
      this.authService.register(formData).subscribe({
        next: (resp: any) => {
          console.log('Registration response:', resp);
          
          // Handle backend response
          if (resp.success) {
            // Registration successful - user is stored in database
            alert('Account created successfully! You can now login with your credentials.');
            this.router.navigate(['/login']);
          } else {
            // Show error message from backend
            alert(resp.message || 'Registration failed');
          }
        },
        error: (err) => {
          console.error('Registration failed', err);
          
          // More specific error messages
          if (err.status === 0) {
            alert('Backend server is not running. Please start the backend server first.');
          } else if (err.status === 400) {
            alert(err.error?.message || 'Email already registered or invalid data');
          } else if (err.status === 500) {
            alert('Server error. Please check the backend server.');
          } else {
            alert(`Registration failed: ${err.message || 'Unknown error'}`);
          }
        }
      });
    } else {
      console.log('Form is invalid. Field errors:');
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        console.log(`${key}:`, control?.errors);
      });
      alert('Please fill in all required fields correctly.');
    }
  }

  // Helper method to check individual field validity
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['minlength']) return 'Password must be at least 6 characters';
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }
}
