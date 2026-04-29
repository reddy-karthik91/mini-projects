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
import { AuthService } from '../../services/auth-service/auth.service';

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
    private router: Router,
    private authService: AuthService
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
        // localStorage.setItem('currentUser', JSON.stringify(userExists));

        // instead of setting the user data in local storage directly from the component, 
        // we will use the AuthService to handle the login state and store the user data. 
        // This way we can centralize the authentication logic and make it easier to manage across the application.
        this.authService.login(userExists);
        this.logInForm.reset();
        this.isSubmitted = false;

        //take to user profile section after 0.5 second
        setTimeout(() => {
          this.router.navigate(['/userProfile']);
        }, 500);
      } else {
        this.isSubmitted = false;
        alert('Invalid email or password. Please try again.');
      }
    }
  }

  togglePassword(){
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
