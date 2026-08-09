import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BuilderState {
  readonly isNavigating = signal(false);
  readonly brainstorm = signal<string>('');
  readonly hasLogo = signal<boolean>(false);
  readonly aiAnswers = signal<Record<string, string | string[]>>({});
  readonly selectedTheme = signal<string>('');
  readonly businessName = signal<string>('');
  readonly businessType = signal<string>('');
  readonly targetAudience = signal<string>('');

  readonly isBrainstormComplete = computed(() => this.brainstorm().length >= 25);

  readonly isAiInterviewComplete = computed(() => {
    const answers = this.aiAnswers();
    return (
      Object.keys(answers).length > 0 &&
      Object.values(answers).every((v) => (Array.isArray(v) ? v.length > 0 : v.trim() !== ''))
    );
  });

  readonly isPreviewComplete = computed(() => this.selectedTheme() !== '');

  readonly isValidationComplete = computed(
    () => this.businessName() !== '' && this.businessType() !== '' && this.targetAudience() !== '',
  );
}
