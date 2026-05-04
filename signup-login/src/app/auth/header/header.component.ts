import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
isLoggedIn: boolean = false;
isAdmin: boolean = false;

constructor(
  private router: Router,
  private authService: AuthService
){}

ngOnInit(): void {

  // 1st method: Check if the user is logged in by checking localStorage
  // this.isLoggedIn=!!localStorage.getItem('currentUser');

  // 2nd method: Subscribe to the login status Observable from AuthService to update the local variable 
  // whenever the login status changes
  this.authService.isLoggedIn$.subscribe((status) => {
    this.isLoggedIn = status; // Update the local variable whenever the login status changes
  });

  // Subscribe to the admin status Observable from AuthService to update the local variable
  this.authService.isAdmin$.subscribe((status) => {
    this.isAdmin = status; // Update the local variable whenever the admin status changes
  })
}

// Logout function to clear user data and navigate to login page
logout(){
  this.authService.logout(); // Call the logout method from AuthService to clear user data and update login status
  this.router.navigate(['/login']);
}
}
