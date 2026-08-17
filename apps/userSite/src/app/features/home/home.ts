import { Component, afterNextRender, inject, signal, effect, OnInit } from '@angular/core';
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

import { ProductCard } from '../product/components/product-card/product-card';
import { ProductListItem } from '../product/types/product';

import { environment } from '../../../environments/environment';
import { ProductApiService } from '../product/service/product-api.service';

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

  constructor() {
    // Animate products when they become available in DOM
    effect(() => {
      const products = this.featuredProducts();
      if (products.length > 0) {
        setTimeout(() => {
          const cards = document.querySelectorAll('.product-card');
          const productsSection = document.querySelector('.products-section');
          if (cards.length > 0 && productsSection) {
            gsap.from(cards, {
              scrollTrigger: {
                trigger: productsSection,
                start: 'top 85%',
              },
              y: 40,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power3.out',
            });
          }
        }, 50);
      }
    });

    afterNextRender(() => {
      // 2. Register the ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // 3. Hero Animation
      const heroElements = document.querySelectorAll('.hero-anim');
      const heroSection = document.querySelector('.hero-section');
      if (heroElements.length > 0 && heroSection) {
        gsap.from(heroElements, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top 80%',
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // 4. Categories Animation
      const catCards = document.querySelectorAll('.category-card');
      const catSection = document.querySelector('.categories-section');
      if (catCards.length > 0 && catSection) {
        gsap.fromTo(
          catCards,
          { y: 40, opacity: 0, scale: 0.8 },
          {
            scrollTrigger: {
              trigger: catSection,
              start: 'top 85%',
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
      }
    });
  }

  ngOnInit() {
    this.apiService
      .getProducts(environment.storeSlug, { sort: 'newest', limit: 4 })
      .subscribe((res) => {
        this.featuredProducts.set(res.items);
      });
  }
}
