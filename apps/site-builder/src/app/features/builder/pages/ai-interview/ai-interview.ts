import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  signal,
  inject,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { lucideChevronLeft, lucideChevronRight, lucideMessageSquare } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan/helm/button';
import { HlmTextarea } from '@spartan/helm/textarea';
import { HlmSeparator } from '@spartan/helm/separator';
import { Router } from '@angular/router';
import { CdkStepper } from '@angular/cdk/stepper';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { hlmP } from '@spartan/helm/typography';
import { HlmLabelImports } from '@spartan/helm/label';
import { HlmInputImports } from '@spartan/helm/input';
import { SpartanStepperImports } from '@/spartan/stepper';
import { TranslatePipe } from '@invento/core';

/* ── LEGACY IMPORTS ──────────────────────────────────────────────
   Restore these if reverting to the GSAP card stepper:
   import { computed, ElementRef, viewChild, viewChildren, effect } from '@angular/core';
   import { gsap } from 'gsap';
   import { HlmCardImports } from '@spartan/helm/card';
   ────────────────────────────────────────────────────────────── */

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

import { LocaleService } from '@invento/core';

const OTHER_OPTION = 'opt_other';
const OTHER_MIN_LEN = 10;
const OTHER_MAX_LEN = 25;

const KEY_TO_ENGLISH: Record<string, string> = {
  opt_ecommerce_physical: 'E-Commerce (Physical)',
  opt_ecommerce_digital: 'E-Commerce (Digital)',
  opt_saas: 'SaaS / Platform',
  opt_service: 'Service Business',
  opt_marketplace: 'Marketplace',
  opt_content_media: 'Content / Media',
  opt_fashion_apparel: 'Fashion & Apparel',
  opt_beauty_wellness: 'Beauty & Wellness',
  opt_food_beverage: 'Food & Beverage',
  opt_tech_gadgets: 'Tech & Gadgets',
  opt_home_living: 'Home & Living',
  opt_sports_outdoors: 'Sports & Outdoors',
  opt_jewelry_accessories: 'Jewelry & Accessories',
  opt_gen_z: 'Gen Z (13–24)',
  opt_millennials: 'Millennials (25–40)',
  opt_gen_x: 'Gen X (41–56)',
  opt_boomers: 'Baby Boomers (57+)',
  opt_all_ages: 'All Ages',
  opt_niche: 'Niche Enthusiasts',
  opt_business: 'Business / Enterprise',
  opt_budget: 'Budget (<$20)',
  opt_mid_range: 'Mid-range ($20–$100)',
  opt_premium: 'Premium ($100–$500)',
  opt_luxury: 'Luxury ($500+)',
  opt_dtc: 'DTC Website',
  opt_mobile_app: 'Mobile App',
  opt_wholesale: 'Wholesale / Retail',
  opt_social: 'Social Commerce',
  opt_subscription: 'Subscription Model',
  opt_drops: 'Limited Drops',
  opt_price: 'Price / Affordability',
  opt_quality: 'Quality / Craftsmanship',
  opt_innovation: 'Innovation / Technology',
  opt_sustainability: 'Sustainability / Ethics',
  opt_experience: 'Customer Experience',
  opt_design: 'Design / Aesthetics',
  opt_other: 'Other (specify)',
};

@Component({
  selector: 'app-ai-interview',
  imports: [
    NgIconComponent,
    HlmButton,
    HlmTextarea,
    HlmLabelImports,
    HlmInputImports,
    HlmSeparator,
    ReactiveFormsModule,
    PageHeader,
    SpartanStepperImports,
    TranslatePipe,
  ],
  providers: [provideIcons({ lucideMessageSquare, lucideChevronLeft, lucideChevronRight })],
  templateUrl: './ai-interview.html',
  styleUrl: './ai-interview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInterview {
  private readonly builderState = inject(BuilderState);
  private readonly router = inject(Router);
  private readonly _localeService = inject(LocaleService);
  protected readonly hlmP = hlmP;
  protected readonly OTHER_OPTION = OTHER_OPTION;
  protected readonly OTHER_MIN_LEN = OTHER_MIN_LEN;
  protected readonly OTHER_MAX_LEN = OTHER_MAX_LEN;

  protected readonly chevronBack = computed(() =>
    this._localeService.isRtl() ? 'lucideChevronRight' : 'lucideChevronLeft',
  );
  protected readonly chevronNext = computed(() =>
    this._localeService.isRtl() ? 'lucideChevronLeft' : 'lucideChevronRight',
  );

  private resolveEnglish(key: string): string {
    return KEY_TO_ENGLISH[key] ?? key;
  }

  private resolveEnglishArray(arr: string[]): string[] {
    return arr.map((k) => this.resolveEnglish(k));
  }

  @ViewChild('stepper') stepper?: CdkStepper;

  form = new FormGroup({
    business_name: new FormControl('', Validators.required),
    business_type: new FormControl('', [
      Validators.required,
      this.otherTextValidator('business_type'),
    ]),
    industry: new FormControl('', [Validators.required, this.otherTextValidator('industry')]),
    target: new FormControl('', [Validators.required, this.otherTextValidator('target')]),
    pricing: new FormControl('', [Validators.required, this.otherTextValidator('pricing')]),
    channels: new FormControl<string[]>(
      [],
      [Validators.required, this.otherTextValidator('channels')],
    ),
    differentiator: new FormControl('', [
      Validators.required,
      this.otherTextValidator('differentiator'),
    ]),
  });

  selectedChannels = signal<string[]>([]);
  otherTextInputs = signal<Record<string, string>>({});

  private otherTextValidator(questionId: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isOther =
        value === OTHER_OPTION || (Array.isArray(value) && value.includes(OTHER_OPTION));
      if (!isOther) return null;
      const otherText = this.otherTextInputs()[questionId]?.trim() ?? '';
      if (otherText.length < OTHER_MIN_LEN || otherText.length > OTHER_MAX_LEN) {
        return { otherTextInvalid: true };
      }
      return null;
    };
  }

  onOtherInput(questionId: string, value: string) {
    this.otherTextInputs.update((current) => ({ ...current, [questionId]: value }));
    this.form.get(questionId)?.updateValueAndValidity();
  }

  toggleChannel(option: string) {
    this.selectedChannels.update((current) =>
      current.includes(option) ? current.filter((c) => c !== option) : [...current, option],
    );
    this.form.get('channels')?.setValue(this.selectedChannels());
    this.form.get('channels')?.markAsTouched();
  }

  /* ── LEGACY FIELDS ─────────────────────────────────────────────
     Restore these if reverting to the GSAP card stepper:
     questionContainer = viewChild<ElementRef<HTMLDivElement>>('questionContainer');
     cards = viewChildren<ElementRef<HTMLDivElement>>('cardElement');
     currentStep = signal<number>(0);
     private prevStepIndex = 0;
     ─────────────────────────────────────────────────────────── */

  questions: InterviewQuestion[] = [
    {
      id: 'business_name',
      label: 'BRAND_NAME',
      prompt: 'question_business_name',
      type: 'text',
    },
    {
      id: 'business_type',
      label: 'ENTITY_TYPE',
      prompt: 'question_business_type',
      type: 'select',
      options: [
        'opt_ecommerce_physical',
        'opt_ecommerce_digital',
        'opt_saas',
        'opt_service',
        'opt_marketplace',
        'opt_content_media',
        OTHER_OPTION,
      ],
      aiPrefill: 'opt_ecommerce_physical',
    },
    {
      id: 'industry',
      label: 'INDUSTRY_VERTICAL',
      prompt: 'question_industry',
      type: 'select',
      options: [
        'opt_fashion_apparel',
        'opt_beauty_wellness',
        'opt_food_beverage',
        'opt_tech_gadgets',
        'opt_home_living',
        'opt_sports_outdoors',
        'opt_jewelry_accessories',
        OTHER_OPTION,
      ],
      aiPrefill: 'opt_fashion_apparel',
    },
    {
      id: 'target',
      label: 'TARGET_DEMOGRAPHIC',
      prompt: 'question_target',
      type: 'select',
      options: [
        'opt_gen_z',
        'opt_millennials',
        'opt_gen_x',
        'opt_boomers',
        'opt_all_ages',
        'opt_niche',
        'opt_business',
        OTHER_OPTION,
      ],
      aiPrefill: 'opt_millennials',
    },
    {
      id: 'pricing',
      label: 'PRICING_TIER',
      prompt: 'question_pricing',
      type: 'select',
      options: ['opt_budget', 'opt_mid_range', 'opt_premium', 'opt_luxury', OTHER_OPTION],
      aiPrefill: 'opt_premium',
    },
    {
      id: 'channels',
      label: 'DISTRIBUTION_CHANNELS',
      prompt: 'question_channels',
      type: 'multiselect',
      options: [
        'opt_dtc',
        'opt_mobile_app',
        'opt_wholesale',
        'opt_social',
        'opt_subscription',
        'opt_drops',
        OTHER_OPTION,
      ],
      aiPrefill: 'opt_dtc, opt_drops, opt_social',
    },
    {
      id: 'differentiator',
      label: 'UNIQUE_VALUE_PROP',
      prompt: 'question_differentiator',
      type: 'select',
      options: [
        'opt_price',
        'opt_quality',
        'opt_innovation',
        'opt_sustainability',
        'opt_experience',
        'opt_design',
        OTHER_OPTION,
      ],
      aiPrefill: 'opt_design',
    },
  ];

  /* ── LEGACY COMPUTED ────────────────────────────────────────────
     progressWidth = computed(() => {
       return `${((this.currentStep() + 1) / this.questions.length) * 100}%`;
     });
     ──────────────────────────────────────────────────────────── */

  constructor() {
    afterNextRender({
      read: () => {
        requestAnimationFrame(() => {
          document.querySelector<HTMLTextAreaElement>('app-ai-interview textarea')?.focus();
        });
      },
    });

    /* ── LEGACY GSAP STEP ANIMATION ──────────────────────────────
       Restore this effect() if reverting to the GSAP card stepper:
       effect(() => {
         const step = this.currentStep();
         const allCards = this.cards();
         if (allCards.length === 0) return;

         const oldCard = allCards[this.prevStepIndex]?.nativeElement;
         const newCard = allCards[step]?.nativeElement;

         if (oldCard && newCard && step !== this.prevStepIndex) {
           const goingForward = step > this.prevStepIndex;

           gsap.set(newCard, {
             display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%',
             x: goingForward ? '100%' : '-100%', opacity: 0,
           });
           gsap.set(oldCard, {
             position: 'absolute', top: 0, left: 0, width: '100%',
           });

           const tl = gsap.timeline({
             onComplete: () => {
               gsap.set(newCard, { position: 'relative', clearProps: 'transform' });
               gsap.set(oldCard, { display: 'none', position: 'relative' });
             },
           });
           tl.to(oldCard, {
             x: goingForward ? '-100%' : '100%', opacity: 0, duration: 0.4, ease: 'power2.inOut',
           }).to(newCard, {
             x: '0%', opacity: 1, duration: 0.4, ease: 'power2.inOut',
           }, '<');
         }
         this.prevStepIndex = step;
       });
       ──────────────────────────────────────────────────────── */
  }

  /* ── LEGACY METHODS ────────────────────────────────────────────
     Restore these if reverting to the GSAP card stepper:

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
         container.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }
     }

     isOtherInputValid(): boolean {
       return this.canSubmit();
     }
     ──────────────────────────────────────────────────────────── */

  canSubmit(): boolean {
    return this.form.valid;
  }

  onNext() {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value as Record<string, string | string[]>;
    const other = this.otherTextInputs();
    for (const key of Object.keys(raw)) {
      let val = raw[key];
      const trimmedOther = other[key]?.trim();
      if (typeof val === 'string') {
        if (val === OTHER_OPTION && trimmedOther) {
          val = trimmedOther;
        } else {
          val = this.resolveEnglish(val);
        }
      } else if (Array.isArray(val)) {
        val = this.resolveEnglishArray(val);
        if (val.includes(this.resolveEnglish(OTHER_OPTION)) && trimmedOther) {
          val = val.map((v) => (v === this.resolveEnglish(OTHER_OPTION) ? trimmedOther : v));
        }
      }
      raw[key] = val;
    }

    this.builderState.aiAnswers.set(raw);
    this.builderState.businessName.set(raw['business_name'] as string);
    this.router.navigate(['/build/validation']);
  }

  onTextareaEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.stepper?.next();
    }
  }
}
