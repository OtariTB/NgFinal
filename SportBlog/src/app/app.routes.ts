import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard-page.component';
import { AuthPageComponent } from './pages/auth/auth-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { PostDetailsPageComponent } from './pages/post-details/post-details-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'posts/:id', component: PostDetailsPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'admin', component: AdminDashboardPageComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' },
];
