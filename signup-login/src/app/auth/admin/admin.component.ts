import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { User } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  users: User[] = [];
  admin!: User;

  // Subscription to track the dashboard timer
  secondsActive:number=0;

  // Subscription to track the dashboard timer and manage session expiration
  private sessionSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ){}

ngOnInit(): void {
  // Get Admin details for the welcome message
  this.admin = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Load all users from localStorage
  this.loadUsers();

  // Subscribe to the dashboard timer to track how long the admin has been active
  this.sessionSubscription = this.authService.getDashTime().subscribe(() =>{
    this.secondsActive++;

    // logic to expire the session after 120 seconds of activity on the dashboard
    if(this.secondsActive === 120){
      this.autoLogout();
    }
  });
}

@HostListener('window:mousemove') // Listen for mouse movement to reset the session timer
@HostListener('window:keydown') // Listen for key presses to reset the session timer
refreshUserState(){
  this.secondsActive = 0; // Reset the session timer on user activity
}

// Method to automatically log out the user after session expiration
autoLogout(){
  this.toastr.warning('Your session has expired. Please log in again.');
  this.authService.logout();
  this.router.navigate(['/login']);
}


loadUsers(){
  const data = localStorage.getItem('users');
  this.users = data ? JSON.parse(data) : [];
}

deleteUser(email: string){
  if (confirm('Are you sure you want to delete this user?')) {
    // Filter out the user
    this.users = this.users.filter(user => user.email !== email);
    // Update localStorage
    localStorage.setItem('users', JSON.stringify(this.users));
    this.toastr.warning('User deleted successfully!');
  }
}
 
ngOnDestroy(): void {
  // Unsubscribe from the dashboard timer to prevent memory leaks
  if (this.sessionSubscription) {
    this.sessionSubscription.unsubscribe();
    // console.log('Admin session timer unsubscribed');
  }
}

}
