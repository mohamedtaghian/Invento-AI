import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';
import { HlmBadge } from '@spartan/helm/badge';

// Icons
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideLaptop,
  lucideHeadphones,
  lucideSmartphone,
  lucideWatch,
  lucideCamera,
  lucideWifi,
  lucideHeart,
  lucideShoppingCart,
  lucideArrowRight,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmButton, HlmCard, HlmBadge, NgIconComponent],
  providers: [
    provideIcons({
      lucideLaptop,
      lucideHeadphones,
      lucideSmartphone,
      lucideWatch,
      lucideCamera,
      lucideWifi,
      lucideHeart,
      lucideShoppingCart,
      lucideArrowRight,
    }),
  ],
  templateUrl: './home.html',
})
export class HomeComponent {
  // Strings MUST match the exact key names passed to provideIcons
  categories = [
    { name: 'Laptops', icon: 'lucideLaptop' },
    { name: 'Audio', icon: 'lucideHeadphones' },
    { name: 'Mobile', icon: 'lucideSmartphone' },
    { name: 'Wearables', icon: 'lucideWatch' },
    { name: 'Cameras', icon: 'lucideCamera' },
    { name: 'Networking', icon: 'lucideWifi' },
  ];

  featuredProducts = [
    {
      id: 1,
      name: 'AuraX Pro ANC Headphones',
      description: 'Immersive sound with adaptive noise cancellation.',
      price: 299,
      image: 'https://placehold.co/400x300/e2e8f0/475569?text=Headphones',
      badge: null,
    },
    {
      id: 2,
      name: 'Nexus Book 14"',
      description: 'M2 chip, 16GB RAM, 512GB SSD for professional workflows.',
      price: 1299,
      image: 'https://placehold.co/400x300/e2e8f0/475569?text=Laptop',
      badge: 'Bestseller',
    },
    {
      id: 3,
      name: 'Chronos Smartwatch Elite',
      description: 'Advanced health tracking and seamless connectivity.',
      price: 349,
      image: 'https://placehold.co/400x300/e2e8f0/475569?text=Watch',
      badge: null,
    },
    {
      id: 4,
      name: 'Tactile Pro Keyboard',
      description: 'Mechanical switches designed for developers and creators.',
      price: 149,
      image: 'https://placehold.co/400x300/e2e8f0/475569?text=Keyboard',
      badge: null,
    },
  ];

  constructor() {
    afterNextRender(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-anim', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      })
        .from(
          '.category-card',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          '-=0.4',
        )
        .from(
          '.product-card',
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
          },
          '-=0.2',
        );
    });
  }
}
