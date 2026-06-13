import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin() {
    console.log('Login attempt with:', this.loginForm.value);

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({

        next: (resp: any) => {
          console.log("FULL LOGIN RESPONSE:", resp);
          console.log("TOKEN:", resp.token);
          if (resp.success) {
            localStorage.setItem("token", resp.token);
            console.log("Saved Token:", localStorage.getItem("token"));
            this.authService.dataStorage.setCurrentUser(resp.user);
            const role = resp.user.role;
            if (role === 'admin') {
              this.router.navigate(['/admin/dashboard']);
            }
            else if (role === 'patient') {
              this.router.navigate(['/patient/dashboard']);
            }
            else {
              this.router.navigate(['/donor/dashboard']);
            }
          }
        },
        error: (err) => {
          console.error('Login failed', err);

          if (err.status === 401) {
            alert('Invalid email or password');
          } else {
            alert('Login failed. Please try again later.');
          }
        }
      });
    }
    else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
