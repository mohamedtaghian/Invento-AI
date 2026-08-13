import { Component, inject, signal, OnInit } from '@angular/core';
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
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    HlmInput,
    HlmLabel,
    HlmButton
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  storeSlug = '';

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\u00C0-\u00FF\u0600-\u06FF\s'\-]+$/)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\u00C0-\u00FF\u0600-\u06FF\s'\-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    // Extract storeSlug from the URL path (e.g. /store/anfasyy/auth/register)
    const slug = this.route.snapshot.paramMap.get('storeSlug')
      ?? this.route.parent?.snapshot.paramMap.get('storeSlug')
      ?? environment.storeSlug;
    this.storeSlug = slug;

    const passwordControl = this.registerForm.get('password');
    const confirmControl = this.registerForm.get('confirmPassword');

    if (passwordControl && confirmControl) {
      confirmControl.disable();
      passwordControl.statusChanges.subscribe(() => {
        if (passwordControl.valid) {
          confirmControl.enable();
        } else {
          confirmControl.disable();
        }
      });
    }
  }

  passwordMatchValidator(g: any) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      toast.error('Please fill all required fields correctly.');
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerPayload = {
      ...this.registerForm.getRawValue(),
      storeSlug: this.storeSlug
    };

    this.isLoading.set(true);
    this.authService.register(registerPayload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        toast.success(res.message || 'Registration successful. Please verify your email.');
        this.router.navigate(['../verify-email'], {
          relativeTo: this.route,
          queryParams: { email: registerPayload.email }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = extractErrorMessage(err, 'Registration failed.');
        toast.error(errorMsg);
      }
    });
  }
}
