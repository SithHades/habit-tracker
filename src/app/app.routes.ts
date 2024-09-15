import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HabitDetailComponent } from './components/habit-detail/habit-detail.component';
import { CreateHabitComponent } from './components/create-habit/create-habit.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'habit/:id',
    component: HabitDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-habit',
    component: CreateHabitComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
