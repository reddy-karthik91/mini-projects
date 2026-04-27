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
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  logInForm: FormGroup;
  isSubmitted: boolean = false;
  isPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  )
    {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
      ]],
    })
  }

  onLogin(){
    //taking a boolean flag for checking the form submission
    this.isSubmitted = true;

    //taking the values of email and password
    const email_value = this.logInForm.get('email')?.value;
    const password_value = this.logInForm.get('password')?.value;

    //checking if the email and password fields are empty, if yes setting an error on both fields
    if(email_value === '' || password_value === '' ){
      this.logInForm.get('email')?.setErrors({ required: true });
      this.logInForm.get('password')?.setErrors({ required: true });
    }

    //logic for form submission
    if(this.logInForm.valid){
      const loginUser = this.logInForm.value;

      //retrieving the existing users from local storage or empty array if none exist
      const existingUser = localStorage.getItem('users');
      const users:User[] = existingUser ? JSON.parse(existingUser) : [];

      // check if email already exists and email and password match
      const userExists = users.find(user => user.email === loginUser.email && user.password === loginUser.password);

      console.log('userExists:', userExists);

      //if user exists, log in successfully, else show an alert for invalid email or password
      if(userExists){
        localStorage.setItem('currentUser', JSON.stringify(userExists));
        this.logInForm.reset();
        this.isSubmitted = false;
        //take to user profile section after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/userProfile']);
        }, 1000);
      } else {
        alert('Invalid email or password. Please try again.');
      }
    }
  }

  togglePassword(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
