import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
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
import {
  lucideDot,
  lucideImagePlus,
  lucideUploadCloud,
  lucideAlertTriangle,
  lucideInfo,
} from '@ng-icons/lucide';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { BrainstormApi } from '@/app/features/builder/services/brainstorm-api';
import { hlmH2, hlmP } from '@spartan/helm/typography';
import { DoubleSlash } from '@/app/shared/components/double-slash/double-slash';
import { toast } from '@spartan/helm/sonner';
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
      lucideImagePlus,
      lucideUploadCloud,
      lucideAlertTriangle,
      lucideInfo,
      heroCheck,
    }),
  ],
})
export class Brainstorm implements OnInit {
  protected readonly MIN_DESCRIPTION_LENGTH = 25;

  logoFile = signal<File | null>(null);
  logoPreview = signal<string | null>(null);
  isDragging = signal<boolean>(false);

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

  ngOnInit() {
    const saved = this.builderState.brainstorm();
    if (saved) {
      this.descriptionControl.setValue(saved, { emitEvent: false });
    }
    this.descriptionControl.valueChanges.subscribe((val) => {
      this.builderState.brainstorm.set(val);
    });
  }

  get validationStatus(): 'EMPTY' | 'TOO_SHORT' | 'MEANINGLESS' | 'VALID' {
    const raw = this.descriptionControl.value || '';
    const trimmed = raw.trim();
    if (trimmed.length === 0) return 'EMPTY';
    if (trimmed.length < this.MIN_DESCRIPTION_LENGTH) return 'TOO_SHORT';

    const words = trimmed.split(/\s+/).filter((w) => w.length >= 2);
    if (words.length < 3) return 'MEANINGLESS';

    const uniqueChars = new Set(trimmed.replace(/\s+/g, '').toLowerCase());
    if (uniqueChars.size < 4) return 'MEANINGLESS';

    return 'VALID';
  }

  get isValidConcept(): boolean {
    return this.validationStatus === 'VALID';
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isFocused()) {
      this.isFocused.set(false);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    this.logoFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.logoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
    this.builderState.hasLogo.set(true);
  }

  removeLogo() {
    this.logoFile.set(null);
    this.logoPreview.set(null);
    this.builderState.hasLogo.set(false);
  }

  onNext() {
    if (!this.isValidConcept || this.isSubmitting()) return;

    const text = this.descriptionControl.value;
    this.builderState.brainstorm.set(text);

    this.isSubmitting.set(true);

    this.brainstormApi.analyzePrompt(text, this.logoFile() || undefined).subscribe({
      next: (response) => {
        console.log('BrainStorm API Response:', response);
        const prefill: Record<string, string | string[]> = {};
        response.questions.forEach((q) => {
          if (q.answer) {
            prefill[q.questionId] = q.answer;
          }
        });

        this.builderState.aiAnswers.set(prefill);
        this.isSubmitting.set(false);
        this.router.navigate(['/build/ai-interview']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        toast.error('Failed to analyze prompt. Please check your connection.');
        console.error(err);
      },
    });
  }

  public isRtl(): boolean {
    return this.localeService.isRtl();
  }
}
