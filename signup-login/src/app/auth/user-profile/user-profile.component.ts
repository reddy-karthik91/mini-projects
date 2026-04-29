import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  currentUser: any;
  editForm!: FormGroup;
  isEditing: boolean = false; //toggle flag

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve the current user from local storage
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.initEditForm();
    }
  }

  initEditForm() {
    this.editForm = this.fb.group({
      firstName: [this.currentUser.firstName],
      lastName: [this.currentUser.lastName],
      email: [this.currentUser.email],
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.editForm.patchValue(this.currentUser);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editUser() {
    this.isEditing = true;
  }

  onSave() {
    if (this.editForm.valid) {
      //get the updated values from the form and merge with current user data
      const updateduser = {
        ...this.currentUser,
        ...this.editForm.value,
      };

      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // 1. USE findIndex to get the position (0, 1, 2...) of the current user in the all users list
      const index = allUsers.findIndex((user: any) => user.email === this.currentUser.email);

      /// 2. Check if the user was actually found (findIndex returns -1 if not found) and if found, 
      // update the user data in the all users array
      if(index !== -1){
        allUsers[index] = updateduser;
        localStorage.setItem('users', JSON.stringify(allUsers));
      }

      // 3. Update local storage with the new user data
      localStorage.setItem('currentUser', JSON.stringify(updateduser));
      this.currentUser = updateduser;

      // 4. Close edit mode
      this.isEditing = false;
    }
  }
}
