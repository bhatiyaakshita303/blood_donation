import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const donorGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const currentUser = authService.getCurrentUser();
        
        // Check if user has donor role
        if (currentUser && currentUser.role === 'donor') {
            return true;
        } else {
            // Redirect to appropriate dashboard if not donor
            if (currentUser.role === 'admin') {
                router.navigate(['/admin/dashboard']);
            } else if (currentUser.role === 'patient') {
                router.navigate(['/patient/dashboard']);
            }
            return false;
        }
    }

    // Redirect to login if not authenticated
    router.navigate(['/login']);
    return false;
};
