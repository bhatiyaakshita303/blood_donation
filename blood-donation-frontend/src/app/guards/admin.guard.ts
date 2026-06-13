import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const currentUser = authService.getCurrentUser();
        
        // Check if user has admin role
        if (currentUser && currentUser.role === 'admin') {
            return true;
        } else {
            // Redirect to appropriate dashboard if not admin
            if (currentUser.role === 'donor') {
                router.navigate(['/donor/dashboard']);
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
