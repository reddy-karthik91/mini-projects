import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth-service/auth.service";
import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isAdmin()){
        return true; // Allow access to the route
    } else {
        alert('Access denied. Admins only.'); // Show an alert for unauthorized access
        router.navigate(['/login']); // Redirect to login page
        return false; // Deny access to the route
    }
}