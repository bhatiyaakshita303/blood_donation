import { Routes } from '@angular/router';

// Visitor / Public pages
import { Home } from './components/visitor/home/home';
import { About } from './components/visitor/about/about';
import { Contact } from './components/visitor/contact/contact';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

// Admin pages
import { Dashboard as AdminDashboard } from './components/admin/dashboard/dashboard';
import { DonorList as AdminDonorList } from './components/admin/donor-list/donor-list';
import { PatientList as AdminPatientList } from './components/admin/patient-list/patient-list';
import { RequestList as AdminRequestList } from './components/admin/request-list/request-list';
import { BloodStock as AdminBloodStock } from './components/admin/blood-stock/blood-stock';

// Donor pages
import { Dashboard as DonorDashboard } from './components/donor/dashboard/dashboard';
import { DonorProfile } from './components/donor/donor-profile/donor-profile';
import { RequestBlood as DonorRequestBlood } from './components/donor/request-blood/request-blood';

// Patient pages
import { Dashboard as PatientDashboard } from './components/patient/dashboard/dashboard';
import { RequestBlood as PatientRequestBlood } from './components/patient/request-blood/request-blood';
import { RequestHistory } from './components/patient/request-history/request-history';
import { Profile as PatientProfile } from './components/patient/profile/profile';

// Guard
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Admin routes
  { path: 'admin/dashboard', component: AdminDashboard, canActivate: [roleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/donor-list', component: AdminDonorList, canActivate: [roleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/patient-list', component: AdminPatientList, canActivate: [roleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/request-list', component: AdminRequestList, canActivate: [roleGuard], data: { expectedRole: 'admin' } },
  { path: 'admin/blood-stock', component: AdminBloodStock, canActivate: [roleGuard], data: { expectedRole: 'admin' } },

  // Donor routes
  { path: 'donor/dashboard', component: DonorDashboard, canActivate: [roleGuard], data: { expectedRole: 'donor' } },
  { path: 'donor/donor-profile', component: DonorProfile, canActivate: [roleGuard], data: { expectedRole: 'donor' } },
  { path: 'donor/request-blood', component: DonorRequestBlood, canActivate: [roleGuard], data: { expectedRole: 'donor' } },

  // Patient routes
  { path: 'patient/dashboard', component: PatientDashboard, canActivate: [roleGuard], data: { expectedRole: 'patient' } },
  { path: 'patient/request-blood', component: PatientRequestBlood, canActivate: [roleGuard], data: { expectedRole: 'patient' } },
  { path: 'patient/request-history', component: RequestHistory, canActivate: [roleGuard], data: { expectedRole: 'patient' } },
  { path: 'patient/profile', component: PatientProfile, canActivate: [roleGuard], data: { expectedRole: 'patient' } },

  // Fallback
  { path: '**', redirectTo: '/home' }
];