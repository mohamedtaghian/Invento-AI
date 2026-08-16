import { Component, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';

// Import your data service
@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, HlmButton, HlmCard],
  templateUrl: './order-confirmed.html',
})
export class OrderConfirmedComponent {
  // Mocking the completed order payload
  order = {
    id: `AC-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date(),
    items: [
      { product: { name: 'Aura Sync Watch', price: 199.99, image: 'assets/images/watch-1.jpg' }, quantity: 1, color: 'Matte Black' },
      { product: { name: 'Nova Pro Earbuds', price: 129.99, image: 'assets/images/earbuds.jpg' }, quantity: 2, color: 'Silver' },
    ],
    shipping: {
      firstName: 'Jane',
      lastName: 'Doe',
      address: '123 Innovation Way',
      city: 'Metropolis',
      email: 'jane.doe@example.com',
    },
  };

  // Calculate totals dynamically
  get subtotal() {
    return this.order.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  get tax() {
    return this.subtotal * 0.08;
  }

  get total() {
    return this.subtotal + this.tax;
  }

  constructor() {
    afterNextRender(() => {
      // Animated Checkmark Pop
      gsap.from('.success-circle', { scale: 0, rotation: -45, duration: 0.6, ease: 'back.out(2)' });

      // Draw SVG Checkmark Path
      gsap.fromTo(
        '.checkmark-path',
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.8, delay: 0.8, ease: 'power2.inOut' },
      );

      // Sequenced Entrance Animation for Cards
      gsap.from('.confirm-anim', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        delay: 0.4,
      });

      // Stagger Timeline Steps
      gsap.from('.border-l-2 > div', { x: -10, opacity: 0, stagger: 0.15, delay: 0.8 });
    });
  }
}
