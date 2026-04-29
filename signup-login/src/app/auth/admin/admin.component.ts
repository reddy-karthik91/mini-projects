import { Component, OnInit } from '@angular/core';
import { User } from '../../models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  users: User[] = [];
  admin!: User;

ngOnInit(): void {
  // Get Admin details for the welcome message
  this.admin = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Load all users from localStorage
  this.loadUsers();
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
    alert('User deleted successfully!');
  }
}


}
