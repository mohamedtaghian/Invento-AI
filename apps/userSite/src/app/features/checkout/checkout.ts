import { Component, afterNextRender, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmLabel } from '@spartan/helm/label';
import { HlmInput } from '@spartan/helm/input';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, HlmLabel, HlmInput, HlmButton, HlmCard],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    expiry: ['', Validators.required],
    cvc: ['', Validators.required],
  });

  constructor() {
    afterNextRender(() => {
      const tl = gsap.timeline();
      tl.from('.fade-in-left', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }).from('.fade-in-right', { x: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.router.navigate(['/order-confirmed']);
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
