import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
  effect,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

import { HlmBadge } from '../../../../libs/ui/badge/src';
import { lucideChevronLeft, lucideChevronRight, lucideMessageSquare } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { HlmButton, HlmButtonImports } from '@spartan/helm/button';
import { HlmTextarea } from '@spartan/helm/textarea';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';
import { HlmLabelImports } from '@spartan/helm/label';
import { HlmSeparator } from '@spartan/helm/separator';
import { PageHeader } from '@/app/components/page-header/page-header';

// Discriminated union types to safely separate questions with options from text entries
export interface BaseQuestion {
  id: string;
  label: string;
  prompt: string;
  aiPrefill?: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'select' | 'multiselect';
  options: string[];
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
}

export type InterviewQuestion = ChoiceQuestion | TextQuestion;

@Component({
  selector: 'app-ai-interview',
  imports: [
    HlmBadge,
    NgIconComponent,
    RouterLink,
    HlmButton,
    HlmTextarea,
    HlmCardImports,
    HlmLabelImports,
    HlmInputImports,
    HlmButtonImports,
    HlmSeparator,
    PageHeader,
  ],
  providers: [provideIcons({ lucideMessageSquare, lucideChevronLeft, lucideChevronRight })],
  templateUrl: './ai-interview.html',
  styleUrl: './ai-interview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInterview {
  // Angular Signals Queries
  questionContainer = viewChild<ElementRef<HTMLDivElement>>('questionContainer');
  cards = viewChildren<ElementRef<HTMLDivElement>>('cardElement');

  currentStep = signal<number>(0);
  private prevStepIndex = 0;

  questions: InterviewQuestion[] = [
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

  constructor() {
    // GSAP Step Animation Orchestrator
    effect(() => {
      const step = this.currentStep();
      const allCards = this.cards();

      if (allCards.length === 0) return;

      const oldCard = allCards[this.prevStepIndex]?.nativeElement;
      const newCard = allCards[step]?.nativeElement;

      if (oldCard && newCard && step !== this.prevStepIndex) {
        const goingForward = step > this.prevStepIndex;

        // 1. Position both elements absolutely over each other during transition to avoid structural jumps
        gsap.set(newCard, {
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          x: goingForward ? '100%' : '-100%',
          opacity: 0,
        });

        gsap.set(oldCard, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        });

        // 2. Run the timeline sync
        const tl = gsap.timeline({
          onComplete: () => {
            // Restore natural layout flow once the animation concludes
            gsap.set(newCard, { position: 'relative', clearProps: 'transform' });
            gsap.set(oldCard, { display: 'none', position: 'relative' });
          },
        });

        tl.to(oldCard, {
          x: goingForward ? '-100%' : '100%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        }).to(
          newCard,
          {
            x: '0%',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          '<',
        ); // '<' forces both tweens to run perfectly together
      }

      this.prevStepIndex = step;
    });
  }

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
    const container = this.questionContainer();
    if (container) {
      container.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
