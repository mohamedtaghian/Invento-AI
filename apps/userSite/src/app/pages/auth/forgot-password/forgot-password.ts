import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../core/service/auth.service';
import { environment } from '../../../../environments/environment';

import { HlmInput } from '@spartan/helm/input';
import { HlmLabel } from '@spartan/helm/label';
import { HlmButton } from '@spartan/helm/button';

import { extractErrorMessage } from '../../../core/utils/error.utils';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    HlmInput,
    HlmLabel,
    HlmButton
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  storeSlug = '';

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    this.storeSlug = this.route.snapshot.paramMap.get('storeSlug')
      ?? this.route.parent?.snapshot.paramMap.get('storeSlug')
      ?? environment.storeSlug;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      toast.error('Please enter a valid email address.');
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const email = this.forgotPasswordForm.value.email!;

    this.isLoading.set(true);
    this.authService.forgotPassword(email, this.storeSlug).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        toast.success(res.message || 'Reset code sent to your email.');
        this.router.navigate(['../reset-password'], {
          relativeTo: this.route,
          queryParams: { email }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = extractErrorMessage(err, 'Failed to send reset code.');
        toast.error(errorMsg);
      }
    });
  }
}
