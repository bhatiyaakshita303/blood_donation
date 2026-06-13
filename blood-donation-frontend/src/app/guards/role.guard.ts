// import { inject } from '@angular/core';
// import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { Auth } from '../services/auth';

// export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
//   const auth = inject(Auth);
//   const router = inject(Router);

//   const expectedRole = route.data['expectedRole']; // 'admin' | 'patient' | 'donor'

//   const currentUser = auth.getCurrentUser();
//   const userRole = currentUser?.role; // get role from user object

//   // If not logged in OR role doesn't match, redirect to login
//   if (!auth.isLoggedIn() || userRole !== expectedRole) {
//     router.navigate(['/login']);
//     return false;
//   }

//   return true;
// };



import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole']; // 'admin' | 'patient' | 'donor'

  // ✅ Get role from localStorage
  const userRole = localStorage.getItem('role');

  if (!auth.isLoggedIn() || userRole !== expectedRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};