import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Check if the user has a token in local storage
  private loggedIn = new BehaviorSubject<boolean>(this.hasUser());
  // Check if the user has admin role in local storage
  private adminStatus = new BehaviorSubject<boolean>(this.isAdmin()); 

  constructor() {}

  // Observable to track login status
  private hasUser(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.role === 'admin';
  }

  // Expose the status as an Observable for components to "listen" to
  isLoggedIn$ = this.loggedIn.asObservable();
 
  // Expose the admin status as an Observable for components to "listen" to
  isAdmin$ = this.adminStatus.asObservable();

  //Methods to update the state
  login(userData: any){
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.loggedIn.next(true); // Update the login status, Broadcast that we are logged in
    this.adminStatus.next(userData.role === 'admin'); // Update the admin status, Broadcast the admin status
  }

  // Method to log out the user
  logout(){
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false); // Update the login status, Broadcast that we are logged out
  }
}
