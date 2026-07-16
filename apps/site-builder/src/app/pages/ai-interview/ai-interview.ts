import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
  effect,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gsap } from 'gsap';
import { HlmBadge } from '@spartan/helm/badge';
import { lucideChevronLeft, lucideChevronRight, lucideMessageSquare } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan/helm/button';
import { HlmTextarea } from '@spartan/helm/textarea';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';
import { HlmLabelImports } from '@spartan/helm/label';
import { HlmSeparator } from '@spartan/helm/separator';
import { Router } from '@angular/router';
import { PageHeader } from '@/app/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { hlmP } from '@spartan/helm/typography';

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

const OTHER_OPTION = 'Other (specify)';
const OTHER_MIN_LEN = 10;
const OTHER_MAX_LEN = 25;

@Component({
  selector: 'app-ai-interview',
  imports: [
    HlmBadge,
    NgIconComponent,
    HlmButton,
    HlmTextarea,
    HlmCardImports,
    HlmLabelImports,
    HlmInputImports,
    HlmSeparator,
    ReactiveFormsModule,
    PageHeader,
  ],
  providers: [provideIcons({ lucideMessageSquare, lucideChevronLeft, lucideChevronRight })],
  templateUrl: './ai-interview.html',
  styleUrl: './ai-interview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInterview {
  private readonly builderState = inject(BuilderState);
  private readonly router = inject(Router);
  protected readonly hlmP = hlmP;

  questionContainer = viewChild<ElementRef<HTMLDivElement>>('questionContainer');
  cards = viewChildren<ElementRef<HTMLDivElement>>('cardElement');

  form = new FormGroup({
    business_name: new FormControl('', Validators.required),
    business_type: new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required),
    target: new FormControl('', Validators.required),
    pricing: new FormControl('', Validators.required),
    channels: new FormControl<string[]>([], Validators.required),
    differentiator: new FormControl('', Validators.required),
  });

  selectedChannels = signal<string[]>([]);
  otherTextInputs = signal<Record<string, string>>({});

  onOtherInput(questionId: string, value: string) {
    this.otherTextInputs.update((current) => ({ ...current, [questionId]: value }));
  }

  toggleChannel(option: string) {
    this.selectedChannels.update((current) =>
      current.includes(option) ? current.filter((c) => c !== option) : [...current, option],
    );
    this.form.get('channels')?.setValue(this.selectedChannels());
    this.form.get('channels')?.markAsTouched();
  }

  currentStep = signal<number>(0);
  private prevStepIndex = 0;

  questions: InterviewQuestion[] = [
    {
      id: 'business_name',
      label: 'BRAND_NAME',
      prompt: 'What is your brand name?',
      type: 'text',
    },
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
        OTHER_OPTION,
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
        OTHER_OPTION,
      ],
      aiPrefill: 'Fashion & Apparel',
    },
    {
      id: 'target',
      label: 'TARGET_DEMOGRAPHIC',
      prompt: 'Describe your primary customer segment',
      type: 'select',
      options: [
        'Gen Z (13–24)',
        'Millennials (25–40)',
        'Gen X (41–56)',
        'Baby Boomers (57+)',
        'All Ages',
        'Niche Enthusiasts',
        'Business / Enterprise',
        OTHER_OPTION,
      ],
      aiPrefill: 'Millennials (25–40)',
    },
    {
      id: 'pricing',
      label: 'PRICING_TIER',
      prompt: 'What pricing tier does your product occupy?',
      type: 'select',
      options: [
        'Budget (<$20)',
        'Mid-range ($20–$100)',
        'Premium ($100–$500)',
        'Luxury ($500+)',
        OTHER_OPTION,
      ],
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
        OTHER_OPTION,
      ],
      aiPrefill: 'DTC Website, Limited Drops, Social Commerce',
    },
    {
      id: 'differentiator',
      label: 'UNIQUE_VALUE_PROP',
      prompt: 'What is your primary competitive differentiator?',
      type: 'select',
      options: [
        'Price / Affordability',
        'Quality / Craftsmanship',
        'Innovation / Technology',
        'Sustainability / Ethics',
        'Customer Experience',
        'Design / Aesthetics',
        OTHER_OPTION,
      ],
      aiPrefill: 'Design / Aesthetics',
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

        const tl = gsap.timeline({
          onComplete: () => {
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
        );
      }
      this.prevStepIndex = step;
    });
  }

  private get currentQuestion(): InterviewQuestion {
    return this.questions[this.currentStep()];
  }

  private isOtherTextValid(questionId: string): boolean {
    const raw = this.otherTextInputs()[questionId] ?? '';
    const trimmed = raw.trim();
    return trimmed.length >= OTHER_MIN_LEN && trimmed.length <= OTHER_MAX_LEN;
  }

  private isOtherSelected(value: unknown): boolean {
    return value === OTHER_OPTION || (Array.isArray(value) && value.includes(OTHER_OPTION));
  }

  canProceedCurrentStep(): boolean {
    const q = this.currentQuestion;
    const control = this.form.get(q.id);
    if (!control || control.invalid) return false;

    if (this.isOtherSelected(control.value)) {
      return this.isOtherTextValid(q.id);
    }
    return true;
  }

  canSubmit(): boolean {
    if (this.form.invalid) return false;
    for (const q of this.questions) {
      const value = this.form.get(q.id)?.value;
      if (this.isOtherSelected(value) && !this.isOtherTextValid(q.id)) {
        return false;
      }
    }
    return true;
  }

  nextStep() {
    if (!this.canProceedCurrentStep()) {
      this.form.get(this.currentQuestion.id)?.markAsTouched();
      return;
    }
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

  isOtherInputValid(): boolean {
    return this.canSubmit();
  }

  onNext() {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value as Record<string, string | string[]>;
    const other = this.otherTextInputs();
    for (const key of Object.keys(raw)) {
      const val = raw[key];
      const trimmedOther = other[key]?.trim();
      if (val === OTHER_OPTION && trimmedOther) {
        raw[key] = trimmedOther;
      } else if (Array.isArray(val) && val.includes(OTHER_OPTION) && trimmedOther) {
        raw[key] = val.map((v) => (v === OTHER_OPTION ? trimmedOther : v));
      }
    }

    this.builderState.aiAnswers.set(raw);
    this.builderState.businessName.set(raw['business_name'] as string);
    this.router.navigate(['/build/preview']);
  }

  onTextareaEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
      keyboardEvent.preventDefault();
      this.nextStep();
    }
  }
}
