import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
isLoggedIn: boolean = false;

constructor(private router: Router){}

ngOnInit(): void {

  // Check if the user is logged in by checking localStorage
  this.isLoggedIn=!!localStorage.getItem('currentUser');
}

// Logout function to clear user data and navigate to login page
logout(){
  localStorage.removeItem('currentUser');
  this.isLoggedIn=false;
  this.router.navigate(['/login']);
}
}
