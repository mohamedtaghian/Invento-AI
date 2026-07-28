import { Component, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

// Spartan UI Imports
import { HlmBadge } from '@spartan/helm/badge';

// Icons
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideHelpCircle,
  lucidePackage,
  lucideTruck,
  lucideCreditCard,
  lucideShield,
  lucideHeadphones,
} from '@ng-icons/lucide';

// Feature
import { FaqDataService } from './service/faq-data.service';
import type { FaqCategory, FaqItem } from './types/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, HlmBadge, NgIconComponent],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideHelpCircle,
      lucidePackage,
      lucideTruck,
      lucideCreditCard,
      lucideShield,
      lucideHeadphones,
    }),
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FaqComponent {
  private readonly faqDataService = inject(FaqDataService);

  protected activeCategory = 'general';
  protected searchQuery = '';

  protected get faqCategories(): readonly FaqCategory[] {
    return this.faqDataService.categories();
  }

  protected get filteredCategories(): FaqCategory[] {
    if (!this.searchQuery.trim()) {
      return [...this.faqCategories];
    }

    const query = this.searchQuery.toLowerCase();
    return this.faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }

  protected get activeFaqItems(): readonly FaqItem[] {
    const category = this.filteredCategories.find((c) => c.id === this.activeCategory);
    return category?.items ?? this.filteredCategories[0]?.items ?? [];
  }

  protected get activeCategoryData(): FaqCategory | undefined {
    return (
      this.filteredCategories.find((c) => c.id === this.activeCategory) ??
      this.filteredCategories[0]
    );
  }

  protected onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    // Reset to first matching category on search
    if (this.filteredCategories.length > 0) {
      const currentStillExists = this.filteredCategories.find((c) => c.id === this.activeCategory);
      if (!currentStillExists) {
        this.activeCategory = this.filteredCategories[0].id;
      }
    }
  }

  protected setCategory(categoryId: string): void {
    this.activeCategory = categoryId;
  }

  protected get totalQuestions(): number {
    return this.faqCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  }

  constructor() {
    // Load FAQ data from service
    this.faqDataService.loadFaqs();

    afterNextRender(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.faq-hero-anim', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
      }).from(
        '.faq-item',
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        '-=0.3',
      );
    });
  }
}
