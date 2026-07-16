import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  output,
  signal,
} from '@angular/core';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { HlmTextareaImports } from '@spartan/helm/textarea';
import { HlmItemImports } from '@spartan/helm/item';
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
import { PageHeader } from '@/app/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { hlmH2, hlmP } from '@spartan/helm/typography';
import { DoubleSlash } from '@/app/shared/components/double-slash/double-slash';

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
  readonly dataSaved = output<void>();

  protected readonly hlmH2 = hlmH2;
  protected readonly hlmP = hlmP;

  protected readonly backdropClass = computed(() =>
    this.isFocused()
      ? 'fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm'
      : '',
  );

  isFocused = signal<boolean>(false);
  contextChecklist: ContextChecklist[] = [
    {
      id: 1,
      content: 'Describe your business concept',
    },
    {
      id: 2,
      content: 'Include your target audience',
    },
    {
      id: 3,
      content: 'Mention your core value proposition',
    },
    {
      id: 4,
      content: 'Add revenue model or industry vertical',
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
    if (this.descriptionControl.valid) {
      this.builderState.brainstorm.set(this.descriptionControl.value);
      this.dataSaved.emit();
    }
  }
}
