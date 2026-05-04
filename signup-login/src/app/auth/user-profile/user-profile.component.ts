import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      // // Check if file is larger than 1MB (1024 * 1024 bytes)
      if(file.size > 1024 * 1024) { 
        this.toastr.error('File is too large! Please choose an image under 1MB.', 'Size Error');
        return;
      }

      const reader = new FileReader();
  
      // This runs once the file is finished being "read"
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.saveImage(base64String);
      };
  
      reader.readAsDataURL(file); // Starts the reading process
    }
  }
  
  saveImage(imageStr: string) {
    this.currentUser.profilePic = imageStr;
    
    // Update the user in your localStorage 'users' array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: any) => u.email === this.currentUser.email);
    
    if (index !== -1) {
      users[index].profilePic = imageStr;
      localStorage.setItem('users', JSON.stringify(users));
      this.toastr.success('Profile picture updated!');
    }
  }
}
