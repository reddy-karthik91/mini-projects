import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signUpForm: FormGroup;
  isSubmitted: boolean = false;
  showSuccessMessage: boolean = false;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    //creating the form
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  //method which submits the form
  onSubmit() {
    //taking a boolean flag for checking the form submission
    this.isSubmitted = true;

    //taking the values of password and confirm password fields
    const password_value = this.signUpForm.get('password')?.value;
    const confirmPassword_value = this.signUpForm.get('confirmPassword')?.value;

    //1.checking if the password and confirm password fields match, if not setting an error on the confirm password field
    //2.Can also add a custom validator to separate the logic of password matching from the form submission logic, but for simplicity, we are doing it here
    if (password_value !== confirmPassword_value) {
      this.signUpForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }

    //logic for form submission
    if (this.signUpForm.valid) {
      const newUser = this.signUpForm.value;

      //assigning a default role to the user, 
      // in a real application this should be handled by the backend and not the frontend for security reasons,
      // but for simplicity, we are doing it here
      const adminEmail = 'admin@project.com';

      if(newUser.email === adminEmail){
        newUser.role = 'admin';
      } else {
        newUser.role = 'user';
      }

      //get existing users from local storage or empty array if none exist
      const existingUserRaw = localStorage.getItem('users');
      const users: User[] = existingUserRaw ? JSON.parse(existingUserRaw) : [];

      //check if email already exists
      const emailExists = users.some((user) => user.email === newUser.email);
      if (emailExists) {
        alert('Email already exists. Please use a different email.');
        return;
      }

      //add new user and save to local storage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      //account creation and submission logic
      console.log('Form submission successful!');
      console.log(this.signUpForm.value);
      console.log('success: ', this.signUpForm.valid);
      this.signUpForm.reset();
      this.isSubmitted = false;

      //success message after successful account creation
      this.showSuccessMessage = true;
      //wait for 3 seconds and then redirect
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
      console.log('Form submission failed!');
      console.log('failure: ', this.signUpForm.valid);
    }
  }

  //function to toggle password visibility
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
    console.log('toggle clicked!');
  }

  //function to toggle password visibility
  toggleConfirmPassword() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    console.log('toggle confirm password clicked!');
  }
}
