import { Component, afterNextRender, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import gsap from 'gsap';

// Spartan UI & Icons
import { HlmLabel } from '@spartan/helm/label';
import { HlmInput } from '@spartan/helm/input';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideShoppingCart,
  lucideShieldCheck,
  lucideTruck,
  lucideArrowLeft,
  lucideTrash2,
  lucideLoader2,
  lucideInfo,
  lucideCheckCircle,
  lucideAlertTriangle,
} from '@ng-icons/lucide';
import { toast } from '@spartan/helm/sonner';

import { CartService } from '../../core/service/cart.service';
import { AuthService } from '../../core/service/auth.service';
import { OrdersDataService } from '../orders/service/orders-data.service';
import { extractErrorMessage } from '../../core/utils/error.utils';
import { environment } from '../../../environments/environment';
import type { CreateOrderPayload } from '../../core/interface/cart.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    RouterLink,
    HlmLabel,
    HlmInput,
    HlmButton,
    HlmCard,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      lucideShoppingCart,
      lucideShieldCheck,
      lucideTruck,
      lucideArrowLeft,
      lucideTrash2,
      lucideLoader2,
      lucideInfo,
      lucideCheckCircle,
      lucideAlertTriangle,
    }),
  ],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly ordersService = inject(OrdersDataService);

  // Cart signals
  readonly cartItems = this.cartService.items;
  readonly currency = this.cartService.currency;
  readonly subtotalAmount = this.cartService.subtotalAmount;
  readonly shippingFee = this.cartService.shippingFee;
  readonly totalAmount = this.cartService.totalAmount;

  // UI state
  readonly isSubmitting = signal<boolean>(false);
  readonly isClearCartModalOpen = signal<boolean>(false);
  readonly activeStoreSlug = signal<string>(environment.storeSlug);

  readonly checkoutForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    contactPhone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
    line1: ['', [Validators.required, Validators.maxLength(200)]],
    line2: ['', [Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    governorate: ['', [Validators.maxLength(100)]],
    postalCode: ['', [Validators.maxLength(20)]],
    country: ['EG', [Validators.required, Validators.maxLength(2)]],
    customerNote: ['', [Validators.maxLength(500)]],
    paymentMethod: ['cod', [Validators.required]],
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

  ngOnInit(): void {
    // Resolve store slug
    const paramSlug =
      this.route.snapshot.paramMap.get('storeSlug') ||
      this.route.parent?.snapshot.paramMap.get('storeSlug');
    if (paramSlug) {
      this.activeStoreSlug.set(paramSlug);
    }

    // Prefill customer & shipping details
    this.prefillForm();
  }

  private prefillForm(): void {
    const prefill = this.cartService.prefilledCustomer();
    const currentUser = this.authService.currentUser();

    let firstName = prefill?.firstName || '';
    let lastName = prefill?.lastName || '';

    if (!firstName && !lastName && prefill?.contactName) {
      const parts = prefill.contactName.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    if (!firstName && currentUser?.firstName) {
      firstName = currentUser.firstName;
    }
    if (!lastName && currentUser?.lastName) {
      lastName = currentUser.lastName;
    }

    const email = prefill?.contactEmail || currentUser?.email || '';
    const phone = prefill?.contactPhone || '';

    const address = prefill?.shippingAddress;

    this.checkoutForm.patchValue({
      firstName,
      lastName,
      email,
      contactPhone: phone,
      line1: address?.line1 || '',
      line2: address?.line2 || '',
      city: address?.city || '',
      governorate: address?.governorate || '',
      postalCode: address?.postalCode || '',
      country: (address?.country || 'EG').toUpperCase(),
      customerNote: prefill?.customerNote || '',
      paymentMethod: 'cod',
    });
  }

  updateQuantity(index: number, delta: number): void {
    this.cartService.updateQuantity(index, delta);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  openClearCartModal(): void {
    this.isClearCartModalOpen.set(true);
  }

  closeClearCartModal(): void {
    this.isClearCartModalOpen.set(false);
  }

  confirmClearCart(): void {
    this.cartService.clearCart();
    this.closeClearCartModal();
    toast.info('Your cart has been cleared.');
  }

  onSubmit(): void {
    if (this.cartItems().length === 0) {
      toast.warning('Your cart is empty. Please add items to checkout.');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      toast.error('Please complete all required delivery details.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.checkoutForm.getRawValue();

    const payload: CreateOrderPayload = {
      items: this.cartItems().map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shippingAddress: {
        line1: formVal.line1?.trim() || '',
        line2: formVal.line2?.trim() || undefined,
        city: formVal.city?.trim() || '',
        governorate: formVal.governorate?.trim() || undefined,
        postalCode: formVal.postalCode?.trim() || undefined,
        country: (formVal.country?.trim() || 'EG').toUpperCase(),
      },
      contactPhone: formVal.contactPhone?.trim() || '',
      customerNote: formVal.customerNote?.trim() || undefined,
      paymentMethod: 'cod',
    };

    const storeSlug = this.activeStoreSlug();

    this.cartService.placeOrder(storeSlug, payload).subscribe({
      next: (placedOrder) => {
        this.isSubmitting.set(false);
        const enteredName = `${formVal.firstName || ''} ${formVal.lastName || ''}`.trim();
        if (enteredName && placedOrder.orderNumber != null) {
          this.ordersService.saveRecipientOverride(placedOrder.orderNumber, enteredName);
        }
        const finalOrder = {
          ...placedOrder,
          createdAt: placedOrder.createdAt || new Date().toISOString(),
          contactName: enteredName || placedOrder.contactName,
        };
        this.cartService.setLastPlacedOrder(finalOrder);
        this.cartService.clearCart();
        this.cartService.clearPrefill();

        toast.success(`Order #${placedOrder.orderNumber} placed successfully!`);
        this.router.navigate(['/', storeSlug, 'order-confirmed'], {
          queryParams: { orderNumber: placedOrder.orderNumber },
        });
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        const errorMsg = extractErrorMessage(
          err,
          'Failed to place your order. Please check your details and try again.',
        );
        toast.error(errorMsg);
      },
    });
  }
}
