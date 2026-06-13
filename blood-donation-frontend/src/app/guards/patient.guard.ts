import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const patientGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const currentUser = authService.getCurrentUser();
        
        // Check if user has patient role
        if (currentUser && currentUser.role === 'patient') {
            return true;
        } else {
            // Redirect to appropriate dashboard if not patient
            if (currentUser.role === 'admin') {
                router.navigate(['/admin/dashboard']);
            } else if (currentUser.role === 'donor') {
                router.navigate(['/donor/dashboard']);
            }
            return false;
        }
    }

    // Redirect to login if not authenticated
    router.navigate(['/login']);
    return false;
};
