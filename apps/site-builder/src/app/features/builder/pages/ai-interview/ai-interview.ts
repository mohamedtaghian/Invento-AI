import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  signal,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { lucideChevronLeft, lucideChevronRight, lucideMessageSquare } from '@ng-icons/lucide';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { HlmButton } from '@spartan/helm/button';
import { HlmTextarea } from '@spartan/helm/textarea';
import { HlmSeparator } from '@spartan/helm/separator';
import { Router } from '@angular/router';
import { CdkStepper, StepperSelectionEvent } from '@angular/cdk/stepper';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { hlmP } from '@spartan/helm/typography';
import { HlmLabelImports } from '@spartan/helm/label';
import { HlmInputImports } from '@spartan/helm/input';
import { SpartanStepperImports } from '@/spartan/stepper';
import { TranslatePipe, LocaleService } from '@invento/core';
import { toast } from '@spartan/helm/sonner';
import { INTERVIEW_QUESTIONS } from '../../constants/interview-questions';
import { AiInterviewApi, SubmitAnswersPayload } from '../../services/ai-interview-api';

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
export class AiInterview implements OnInit {
  private readonly builderState = inject(BuilderState);
  private readonly router = inject(Router);
  private readonly _localeService = inject(LocaleService);
  private readonly aiInterviewApi = inject(AiInterviewApi);
  protected readonly hlmP = hlmP;

  readonly isSubmitting = signal(false);

  protected readonly chevronBack = computed(() =>
    this._localeService.isRtl() ? 'lucideChevronRight' : 'lucideChevronLeft',
  );
  protected readonly chevronNext = computed(() =>
    this._localeService.isRtl() ? 'lucideChevronLeft' : 'lucideChevronRight',
  );

  @ViewChild('stepper') stepper?: CdkStepper;

  visibleQuestions = computed(() => {
    const hasLogo = this.builderState.hasLogo();
    return INTERVIEW_QUESTIONS.filter((q) => {
      if (q.showWhen === 'logoUploaded' && !hasLogo) return false;
      return true;
    });
  });

  form = new FormGroup({});
  selectedChannels = signal<Record<string, string[]>>({});

  constructor() {
    afterNextRender({
      read: () => {
        requestAnimationFrame(() => {
          document
            .querySelector<
              HTMLInputElement | HTMLTextAreaElement
            >('app-ai-interview input, app-ai-interview textarea')
            ?.focus();
        });
      },
    });
  }

  ngOnInit() {
    const controls: Record<string, FormControl> = {};
    const prefill = this.builderState.aiAnswers();

    this.visibleQuestions().forEach((q) => {
      const validators = q.required ? [Validators.required] : [];
      let initialValue: string | string[] = q.type === 'multi' ? [] : '';

      if (prefill[q.id] !== undefined && prefill[q.id] !== null) {
        const rawVal = prefill[q.id];

        if (q.type === 'multi') {
          let matchedOptions: string[];
          if (Array.isArray(rawVal)) {
            matchedOptions = rawVal.map((v) => {
              if (typeof v === 'number' && q.options?.[v]) return q.options[v];
              if (/^\d+$/.test(String(v).trim()) && q.options?.[parseInt(String(v).trim(), 10)]) {
                return q.options[parseInt(String(v).trim(), 10)];
              }
              return String(v);
            });
          } else {
            const rawStr = String(rawVal).trim();
            const parts = rawStr.split(',').map((s) => s.trim());
            matchedOptions = parts.map((part) => {
              if (/^\d+$/.test(part) && q.options?.[parseInt(part, 10)]) {
                return q.options[parseInt(part, 10)];
              }
              const found = (q.options || []).find(
                (opt) =>
                  opt.toLowerCase().includes(part.toLowerCase()) ||
                  part.toLowerCase().includes(opt.toLowerCase()),
              );
              return found || part;
            });
          }

          initialValue = matchedOptions;
          this.selectedChannels.update((prev) => ({ ...prev, [q.id]: initialValue as string[] }));
        } else if (q.type === 'single') {
          const strVal = String(rawVal).trim();
          let matchedOpt: string | undefined;

          if (/^\d+$/.test(strVal) && q.options?.[parseInt(strVal, 10)]) {
            matchedOpt = q.options[parseInt(strVal, 10)];
          } else {
            matchedOpt = (q.options || []).find(
              (opt) =>
                opt.toLowerCase() === strVal.toLowerCase() ||
                strVal.toLowerCase().includes(opt.toLowerCase()) ||
                opt.toLowerCase().includes(strVal.toLowerCase()),
            );
          }
          initialValue = matchedOpt || strVal;
        } else {
          initialValue = String(rawVal);
        }
      }

      controls[q.id] = new FormControl(initialValue, validators);
    });

    this.form = new FormGroup(controls);

    this.form.valueChanges.subscribe((val) => {
      const current = this.builderState.aiAnswers();
      this.builderState.aiAnswers.set({ ...current, ...val });
    });
  }

  invalidQuestionId = signal<string | null>(null);

  scrollToStep(index: number) {
    setTimeout(() => {
      const stepElements = document.querySelectorAll(
        'spartan-step, [spartanstep], .spartan-step, cdk-step',
      );
      const activeEl =
        stepElements[index] ||
        document.querySelector('.spartan-step-active') ||
        document.querySelector('spartan-step');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = activeEl.querySelector<HTMLElement>(
          'input, textarea, button, [tabindex="0"]',
        );
        if (focusable) focusable.focus();
      }
    }, 100);
  }

  onSelectionChange(event: StepperSelectionEvent) {
    this.scrollToStep(event.selectedIndex);
  }

  onPrevStep() {
    if (this.stepper) {
      this.stepper.previous();
      this.scrollToStep(this.stepper.selectedIndex);
    }
  }

  onNextStep() {
    if (this.stepper) {
      this.stepper.next();
      this.scrollToStep(this.stepper.selectedIndex);
    }
  }

  isQuestionInvalid(questionId: string): boolean {
    if (this.invalidQuestionId() === questionId) return true;
    const control = this.form.get(questionId);
    if (!control || !control.touched) return false;
    const val = control.value;
    const q = INTERVIEW_QUESTIONS.find((item) => item.id === questionId);
    if (!q) return false;
    if (q.type === 'multi') {
      return !Array.isArray(val) || val.length === 0;
    }
    return val === null || val === undefined || String(val).trim() === '';
  }

  findFirstInvalidQuestionIndex(): number {
    const questions = this.visibleQuestions();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const control = this.form.get(q.id);
      const val = control?.value;
      const isAnswered =
        q.type === 'multi'
          ? Array.isArray(val) && val.length > 0
          : val !== null && val !== undefined && String(val).trim() !== '';

      if (!isAnswered || control?.invalid) {
        return i;
      }
    }
    return -1;
  }

  toggleMultiSelect(questionId: string, option: string) {
    this.selectedChannels.update((current) => {
      const selected = current[questionId] || [];
      const updated = selected.includes(option)
        ? selected.filter((c) => c !== option)
        : [...selected, option];

      return { ...current, [questionId]: updated };
    });

    this.form.get(questionId)?.setValue(this.selectedChannels()[questionId]);
    this.form.get(questionId)?.markAsTouched();
    if (this.invalidQuestionId() === questionId) {
      this.invalidQuestionId.set(null);
    }
  }

  canSubmit(): boolean {
    if (!this.form.valid) return false;
    return this.visibleQuestions().every((q) => {
      const val = this.form.get(q.id)?.value;
      if (q.type === 'multi') {
        return Array.isArray(val) && val.length > 0;
      }
      return val !== null && val !== undefined && String(val).trim() !== '';
    });
  }

  onNext() {
    const invalidIndex = this.findFirstInvalidQuestionIndex();
    if (invalidIndex !== -1) {
      const invalidQ = this.visibleQuestions()[invalidIndex];
      this.invalidQuestionId.set(invalidQ.id);
      this.form.markAllAsTouched();

      if (this.stepper) {
        this.stepper.selectedIndex = invalidIndex;
      }
      this.scrollToStep(invalidIndex);
      toast.error('Please answer all required questions before submitting.');
      return;
    }

    this.invalidQuestionId.set(null);

    if (!this.canSubmit() || this.isSubmitting()) {
      this.form.markAllAsTouched();
      toast.error('Please answer all questions before submitting.');
      return;
    }

    const raw = this.form.value as Record<string, string | string[]>;
    const finalAnswers = { ...this.builderState.aiAnswers(), ...raw };
    this.builderState.aiAnswers.set(finalAnswers);

    if (raw['q1']) {
      this.builderState.businessName.set(raw['q1'] as string);
    }

    this.isSubmitting.set(true);

    const questionsPayload = this.visibleQuestions().map((q) => {
      const formVal = this.form.get(q.id)?.value;

      if (q.type === 'text') {
        const str = (formVal || '').toString().trim();
        return { questionId: q.id, answer: str ? str : null };
      }

      if (q.type === 'single') {
        if (formVal === null || formVal === undefined || formVal === '') {
          return { questionId: q.id, answer: null };
        }
        if (typeof formVal === 'number') {
          return { questionId: q.id, answer: formVal };
        }
        const str = String(formVal).trim();
        if (str.toLowerCase() === 'let ai choose') {
          return { questionId: q.id, answer: null };
        }
        const optIndex = (q.options || []).findIndex(
          (opt) => opt.toLowerCase() === str.toLowerCase(),
        );
        return { questionId: q.id, answer: optIndex !== -1 ? optIndex : null };
      }

      if (q.type === 'multi') {
        const arr = Array.isArray(formVal) ? formVal : [];
        if (arr.length === 0) {
          return { questionId: q.id, answer: null };
        }
        const indices = arr
          .map((item) => {
            if (typeof item === 'number') return item;
            if (/^\d+$/.test(String(item).trim())) return parseInt(String(item).trim(), 10);
            return (q.options || []).findIndex(
              (opt) => opt.toLowerCase() === String(item).trim().toLowerCase(),
            );
          })
          .filter((idx) => idx !== -1);

        return { questionId: q.id, answer: indices.length > 0 ? indices : null };
      }

      return { questionId: q.id, answer: null };
    });

    const payload: SubmitAnswersPayload = { questions: questionsPayload };

    this.aiInterviewApi.submitAnswers(payload).subscribe({
      next: (res) => {
        console.log('Submit Answers API Response:', res);
        this.isSubmitting.set(false);
        this.router.navigate(['/build/validation']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        toast.error('Failed to submit answers. Please try again.');
        console.error(err);
      },
    });
  }

  onInputEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.stepper?.next();
    }
  }
}
