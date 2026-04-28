import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    //check if current user is available in local storage
    const user = localStorage.getItem('currentUser');

    if(user){
        router.navigate(['/userProfile']); //Redirect to user profile page
        return false;
    } else {
        return true;
    }
}