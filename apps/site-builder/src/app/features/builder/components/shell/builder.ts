import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { SpartanStepperImports } from '@/spartan/stepper';
import { HlmButtonImports } from '@spartan/helm/button';
import { Brainstorm } from '@/app/pages/brainstorm/brainstorm';
import { AiInterview } from '@/app/pages/ai-interview/ai-interview';
import { Preview } from '@/app/pages/preview/preview';
import { Validation } from '@/app/pages/validation/validation';
import { BuilderState } from '../../services/builder-state';
import { PreviewDataClient } from '@/app/core/service/preview-data-client';
import { TypingText } from '@/app/components/home-components/typing-text/typing-text';
import { AiLoader } from '@/app/components/ai-loader/ai-loader';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [
    SpartanStepperImports,
    HlmButtonImports,
    Brainstorm,
    AiInterview,
    Preview,
    Validation,
    TypingText,
    AiLoader,
  ],
  templateUrl: './builder.html',
  styleUrl: './builder.css',
})
export class BuilderShell {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('stepper') stepper: any;
  readonly builderState = inject(BuilderState);
  private readonly previewDataClient = inject(PreviewDataClient);

  readonly processingAi = signal(false);

  readonly aiLoadingWords = [
    'Analyzing your brand…',
    'Generating themes…',
    'Crafting your design…',
    'Almost ready…',
  ];

  constructor() {
    effect(() => {
      const loading = this.previewDataClient.isLoading();
      if (!loading) {
        this.processingAi.set(false);
      }
    });
  }

  onStepChange(event: { selectedIndex: number; previouslySelectedIndex: number }) {
    const targetIndex = event.selectedIndex;
    if (!this.isStepReachable(targetIndex)) {
      queueMicrotask(() => {
        this.stepper.selectedIndex = event.previouslySelectedIndex;
      });
    }
  }

  onAiInterviewDone(): void {
    this.processingAi.set(true);
    this.aiInterviewControl.setValue(true);
    this.stepper.next();
  }

  private isStepReachable(index: number): boolean {
    for (let i = 0; i < index; i++) {
      if (!this.isStepComplete(i)) {
        return false;
      }
    }
    return true;
  }

  private isStepComplete(index: number): boolean {
    switch (index) {
      case 0:
        return this.builderState.isBrainstormComplete();
      case 1:
        return this.builderState.isAiInterviewComplete();
      case 2:
        return this.builderState.isPreviewComplete();
      case 3:
        return this.builderState.isValidationComplete();
      default:
        return false;
    }
  }

  brainstormControl = new FormControl(false, Validators.requiredTrue);
  aiInterviewControl = new FormControl(false, Validators.requiredTrue);
  previewControl = new FormControl(false, Validators.requiredTrue);
  validationControl = new FormControl(false, Validators.requiredTrue);
}
