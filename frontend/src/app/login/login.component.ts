import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {

  email: string = '';
  password: string = '';


  // Placeholder login function simulating authentication
  login(): boolean {
    console.log("Login attempt:", { email: this.email, password: this.password });

    // Mock validation for testing
    if (this.email === 'test@example.com' && this.password === 'password123') {
      return true; // Login successful
    } else {
      return false; // Login failed
    }
  }

  // Handle form submission
  onSubmit(): void {
    const isLoginSuccessful = this.login();

    if (isLoginSuccessful) {
      alert('Login successful!');
      // Implement redirection logic here (e.g., route to dashboard)
    }
  }
}
