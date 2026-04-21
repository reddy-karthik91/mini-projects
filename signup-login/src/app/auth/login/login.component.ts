import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  logInForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
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
    this.isSubmitted = true;

    const email_value = this.logInForm.get('email')?.value;
    const password_value = this.logInForm.get('password')?.value;

    if(email_value === '' || password_value === '' ){
      this.logInForm.get('email')?.setErrors({ required: true });
      this.logInForm.get('password')?.setErrors({ required: true });
    }

    if(this.logInForm.valid){
      console.log('Login successful!');
      console.log(this.logInForm.value);
      console.log('success: ',this.logInForm.valid);
      this.logInForm.reset();
      this.isSubmitted = false;
    } else {
      console.log('Login failed. Please check your input.');
      console.log('failure: ',this.logInForm.valid);
    }
  }

}
