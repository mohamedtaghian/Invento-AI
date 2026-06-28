import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { HlmBadge } from '../../../../libs/ui/badge/src';
import { lucideChevronLeft, lucideChevronRight, lucideMessageSquare } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan/helm/button';
import { HlmTextarea } from '@spartan/helm/textarea';
@Component({
  selector: 'app-ai-interview',
  imports: [HlmBadge, NgIconComponent, RouterLink, HlmButton, HlmTextarea],
  providers: [provideIcons({ lucideMessageSquare, lucideChevronLeft, lucideChevronRight })],
  templateUrl: './ai-interview.html',
  styleUrl: './ai-interview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInterview {
  @ViewChild('questionContainer') questionContainer!: ElementRef<HTMLDivElement>;
  currentStep = signal<number>(0);

  questions = [
    {
      id: 'business_type',
      label: 'ENTITY_TYPE',
      prompt: 'What type of business are you building?',
      type: 'select',
      options: [
        'E-Commerce (Physical)',
        'E-Commerce (Digital)',
        'SaaS / Platform',
        'Service Business',
        'Marketplace',
        'Content / Media',
      ],
      aiPrefill: 'E-Commerce (Physical)',
    },
    {
      id: 'industry',
      label: 'INDUSTRY_VERTICAL',
      prompt: 'Which industry vertical does this operate in?',
      type: 'select',
      options: [
        'Fashion & Apparel',
        'Beauty & Wellness',
        'Food & Beverage',
        'Tech & Gadgets',
        'Home & Living',
        'Sports & Outdoors',
        'Jewelry & Accessories',
      ],
      aiPrefill: 'Fashion & Apparel',
    },
    {
      id: 'target',
      label: 'TARGET_DEMOGRAPHIC',
      prompt: 'Describe your primary customer segment',
      type: 'text',
      aiPrefill: 'Gen Z and Millennials (18–32), urban, digitally native, values sustainability',
    },
    {
      id: 'pricing',
      label: 'PRICING_TIER',
      prompt: 'What pricing tier does your product occupy?',
      type: 'select',
      options: ['Budget (<$20)', 'Mid-range ($20–$100)', 'Premium ($100–$500)', 'Luxury ($500+)'],
      aiPrefill: 'Premium ($100–$500)',
    },
    {
      id: 'channels',
      label: 'DISTRIBUTION_CHANNELS',
      prompt: 'How will products reach customers?',
      type: 'multiselect',
      options: [
        'DTC Website',
        'Mobile App',
        'Wholesale / Retail',
        'Social Commerce',
        'Subscription Model',
        'Limited Drops',
      ],
      aiPrefill: 'DTC Website, Limited Drops, Social Commerce',
    },
    {
      id: 'differentiator',
      label: 'UNIQUE_VALUE_PROP',
      prompt: 'What is your primary competitive differentiator?',
      type: 'text',
      aiPrefill: 'Ethical manufacturing + limited-edition drops + community access tiers',
    },
  ];

  progressWidth = computed(() => {
    return `${((this.currentStep() + 1) / this.questions.length) * 100}%`;
  });

  nextStep() {
    if (this.currentStep() < this.questions.length - 1) {
      this.currentStep.update((prev) => prev + 1);
      this.scrollToQuestionTop();
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update((prev) => prev - 1);
      this.scrollToQuestionTop();
    }
  }

  private scrollToQuestionTop() {
    if (this.questionContainer) {
      this.questionContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
