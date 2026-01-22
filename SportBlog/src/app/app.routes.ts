import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard-page.component';
import { AuthPageComponent } from './pages/auth/auth-page.component';
import { CategoryPageComponent } from './pages/category/category-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { PostDetailsPageComponent } from './pages/post-details/post-details-page.component';
import { UserProfilePageComponent } from './pages/user-profile/user-profile-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'category/:category', component: CategoryPageComponent },
  { path: 'posts/:id', component: PostDetailsPageComponent },
  { path: 'user/:id', component: UserProfilePageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'admin', component: AdminDashboardPageComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' },
];
