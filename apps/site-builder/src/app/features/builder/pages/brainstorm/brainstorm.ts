import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { HlmButtonImports } from '@spartan/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBolt,
  heroArrowRight,
  heroXMark,
  heroArrowsPointingOut,
  heroCheck,
} from '@ng-icons/heroicons/outline';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { lucideDot } from '@ng-icons/lucide';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { BrainstormApi } from '@/app/features/builder/services/brainstorm-api';
import { hlmH2, hlmP } from '@spartan/helm/typography';
import { DoubleSlash } from '@/app/shared/components/double-slash/double-slash';
import { Router } from '@angular/router';
import { TranslatePipe } from '@invento/core';
import { LocaleService } from '@invento/core';
import { HlmTextareaImports } from '@spartan/helm/textarea';
import { HlmItemImports } from '@spartan/helm/item';

interface ContextChecklist {
  id: number;
  content: string;
}

@Component({
  selector: 'app-brainstorm',
  imports: [
    HlmBadgeImports,
    HlmTextareaImports,
    HlmButtonImports,
    NgIcon,
    HlmItemImports,
    ReactiveFormsModule,
    PageHeader,
    DoubleSlash,
    TranslatePipe,
  ],
  templateUrl: './brainstorm.html',
  styleUrl: './brainstorm.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      heroBolt,
      heroArrowRight,
      heroXMark,
      heroArrowsPointingOut,
      lucideDot,
      heroCheck,
    }),
  ],
})
export class Brainstorm {
  protected readonly MIN_DESCRIPTION_LENGTH = 25;

  private readonly builderState = inject(BuilderState);
  private readonly brainstormApi = inject(BrainstormApi);
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  protected readonly hlmH2 = hlmH2;
  protected readonly hlmP = hlmP;

  protected readonly backdropClass = computed(() =>
    this.isFocused()
      ? 'fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm'
      : '',
  );

  isFocused = signal<boolean>(false);
  readonly isSubmitting = signal(false);

  contextChecklist: ContextChecklist[] = [
    {
      id: 1,
      content: 'brainstorm_check_1',
    },
    {
      id: 2,
      content: 'brainstorm_check_2',
    },
    {
      id: 3,
      content: 'brainstorm_check_3',
    },
    {
      id: 4,
      content: 'brainstorm_check_4',
    },
  ];

  readonly descriptionControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(this.MIN_DESCRIPTION_LENGTH)],
  });

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isFocused()) {
      this.isFocused.set(false);
    }
  }

  onNext() {
    if (this.descriptionControl.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const text = this.descriptionControl.value;
    this.builderState.brainstorm.set(text);

    this.brainstormApi.analyzePrompt(text).subscribe({
      next: (response) => {
        const prefill: Record<string, string | string[]> = {};
        if (response.business_name) prefill['business_name'] = response.business_name;
        if (response.business_type) prefill['business_type'] = response.business_type;
        if (response.industry) prefill['industry'] = response.industry;
        if (response.target) prefill['target'] = response.target;
        if (response.pricing) prefill['pricing'] = response.pricing;
        if (response.channels) prefill['channels'] = response.channels;
        if (response.differentiator) prefill['differentiator'] = response.differentiator;
        this.builderState.aiAnswers.set(prefill);
        this.isSubmitting.set(false);
        this.router.navigate(['/build/ai-interview']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/build/ai-interview']);
      },
    });
  }

  public isRtl(): boolean {
    return this.localeService.isRtl();
  }
}
