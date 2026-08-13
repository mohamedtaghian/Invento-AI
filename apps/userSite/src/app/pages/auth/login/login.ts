import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { toast } from '@spartan/helm/sonner';
import { AuthService } from '../../../core/service/auth.service';
import { environment } from '../../../../environments/environment';

import { HlmInput } from '@spartan/helm/input';
import { HlmLabel } from '@spartan/helm/label';
import { HlmButton } from '@spartan/helm/button';

import { extractErrorMessage } from '../../../core/utils/error.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    HlmInput,
    HlmLabel,
    HlmButton
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      toast.error('Please enter valid email and password.');
      this.loginForm.markAllAsTouched();
      return;
    }

    const storeSlug = this.route.snapshot.paramMap.get('storeSlug')
      ?? this.route.parent?.snapshot.paramMap.get('storeSlug')
      ?? environment.storeSlug;

    const loginPayload = {
      ...this.loginForm.value,
      storeSlug
    };

    this.isLoading.set(true);
    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.isLoading.set(false);
        toast.success('Logged in successfully');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = extractErrorMessage(err, 'Login failed. Please check your credentials.');
        toast.error(errorMsg);
      }
    });
  }
}
