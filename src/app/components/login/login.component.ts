import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode = true;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: [''],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required]);
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.authForm.valid) {
      try {
        if (this.isLoginMode) {
          await this.authService.login(
            this.authForm.get('email')?.value,
            this.authForm.get('password')?.value
          );
        } else {
          await this.authService.register(
            this.authForm.get('email')?.value,
            this.authForm.get('password')?.value,
            this.authForm.get('name')?.value
          );
        }
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Authentication error:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }
}
