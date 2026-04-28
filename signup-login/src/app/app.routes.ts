import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { LandingPageComponent } from './auth/landing-page/landing-page.component';
import { authGuard } from './auth/auth.guard';
import { guestGuard } from './auth/guest.guard';

export const routes: Routes = [
    {path: 'signup', component: SignupComponent, canActivate: [guestGuard]},
    {path: 'login', component: LoginComponent,  canActivate: [guestGuard]},
    {path: 'userProfile', component: UserProfileComponent, canActivate: [authGuard]},
    {path: '', component: LandingPageComponent, canActivate: [guestGuard]},
    {path: '', redirectTo: '/landingPage', pathMatch: 'full'},
];
