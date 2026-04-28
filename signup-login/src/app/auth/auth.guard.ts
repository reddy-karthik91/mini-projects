import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    //check if currentUser exists in localStorage
    const user = localStorage.getItem('currentUser');

    if(user) {
        return true; //Allow access
    } else {
        router.navigate(['/login']); //Redirect to login page
        return false; //Deny access
    }
};