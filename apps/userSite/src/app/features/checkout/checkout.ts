import { Component, afterNextRender, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmLabel } from '@spartan/helm/label';
import { HlmInput } from '@spartan/helm/input';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';

// Import your data service (adjust the path based on your folder structure)
import { ProductsData } from '../product/service/products-data';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, HlmLabel, HlmInput, HlmButton, HlmCard],
  templateUrl: './checkout.html',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private productsData = inject(ProductsData);

  // 1. Mocking a cart using signals and your real data service
  cartItems = signal([
    { product: this.productsData.products()[0], quantity: 1, color: 'Matte Black' },
    { product: this.productsData.products()[1], quantity: 2, color: 'Silver' },
  ]);

  // 2. Automatically calculated totals
  subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );
  tax = computed(() => this.subtotal() * 0.08); // 8% tax rate
  total = computed(() => this.subtotal() + this.tax());

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

  // 3. Logic to handle the + and - buttons
  updateQuantity(index: number, delta: number) {
    this.cartItems.update((items) => {
      const updated = [...items];
      const newQuantity = updated[index].quantity + delta;

      // Prevent quantity from going below 1
      if (newQuantity > 0) {
        updated[index].quantity = newQuantity;
      }
      return updated;
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
