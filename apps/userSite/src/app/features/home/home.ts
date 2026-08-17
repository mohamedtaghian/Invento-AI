import { Component, afterNextRender, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// 1. Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';
import { HlmBadge } from '@spartan/helm/badge';

import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideLaptop,
  lucideHeadphones,
  lucideSmartphone,
  lucideWatch,
  lucideCamera,
  lucideWifi,
  lucideArrowRight,
} from '@ng-icons/lucide';

import { ProductCard } from '@invento/user-site/app/features/product';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';

import { environment } from '../../../environments/environment';
import { ProductApiService } from '@invento/user-site/app/features/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmButton, HlmCard, HlmBadge, NgIconComponent, ProductCard],
  providers: [
    provideIcons({
      lucideLaptop,
      lucideHeadphones,
      lucideSmartphone,
      lucideWatch,
      lucideCamera,
      lucideWifi,
      lucideArrowRight,
    }),
  ],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  private readonly apiService = inject(ProductApiService);

  categories = [
    { name: 'Laptops', icon: 'lucideLaptop' },
    { name: 'Audio', icon: 'lucideHeadphones' },
    { name: 'Mobile', icon: 'lucideSmartphone' },
    { name: 'Wearables', icon: 'lucideWatch' },
    { name: 'Cameras', icon: 'lucideCamera' },
    { name: 'Networking', icon: 'lucideWifi' },
  ];

  featuredProducts = signal<ProductListItem[]>([]);

  ngOnInit() {
    this.apiService
      .getProducts(environment.storeSlug, { sort: 'newest', limit: 4 })
      .subscribe((res) => {
        this.featuredProducts.set(res.items);
      });
  }

  constructor() {
    afterNextRender(() => {
      // 2. Register the ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // 3. Hero Animation (triggers when hero section is 80% in view, essentially immediately on load)
      gsap.from('.hero-anim', {
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // 4. Categories Animation
      gsap.fromTo(
        '.category-card',
        { y: 40, opacity: 0, scale: 0.8 },
        {
          scrollTrigger: {
            trigger: '.categories-section',
            start: 'top 85%', // Triggers when the top of the categories section hits 85% down the viewport
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          clearProps: 'transform,opacity',
        },
      );

      // 5. Featured Products Animation
      gsap.from('.product-card', {
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 85%', // Triggers when the top of the products section hits 85% down the viewport
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      });
    });
  }
}
