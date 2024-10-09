import { AuthService } from './../services/authService';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, ReactiveFormsModule], // Import CommonModule and ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Extract values from form
      this.authService.login(email, password).subscribe(response => {
        localStorage.setItem('token', response.token);
        // Redirect to admin panel or show success message
      });
    } else {
      console.error('Form is invalid');
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe(
        response => {
          console.log('Registration successful!', response);
        },
        error => {
          console.error('Registration failed:', error);
        }
      );
    }
  }
}
