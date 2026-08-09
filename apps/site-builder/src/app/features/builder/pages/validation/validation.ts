import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideGlobe,
  lucideAlertTriangle,
  lucideCheckCircle2,
  lucideSearch,
  lucideLoader2,
  lucideSparkles,
  lucideLayers,
  lucideTerminal,
  lucideExternalLink,
  lucideShoppingCart,
} from '@ng-icons/lucide';
import {
  AIAnalysis,
  DomainResult,
  InventoEngineService,
} from '../../../../core/service/invento-engine.service';
import { HlmLabel } from '@spartan/helm/label';
import { HlmInput } from '@spartan/helm/input';
import { HlmButton } from '@spartan/helm/button';
import { HlmBadge } from '@spartan/helm/badge';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan/helm/card';
import { PageHeader } from '@/app/shared/components/page-header/page-header';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { TranslatePipe } from '@invento/core';

// Spartan Components mapped as clean standalone direct imports

type WorkflowStep = 'INPUT' | 'AI_ANALYSIS' | 'DOMAINS' | 'FINAL_REPORT' | 'BUILDING' | 'DEPLOYED';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    HlmLabel,
    HlmInput,
    HlmButton,
    HlmBadge,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    PageHeader,
    TranslatePipe,
  ],
  providers: [
    provideIcons({
      lucideGlobe,
      lucideAlertTriangle,
      lucideCheckCircle2,
      lucideSearch,
      lucideLoader2,
      lucideSparkles,
      lucideLayers,
      lucideTerminal,
      lucideExternalLink,
      lucideShoppingCart,
    }),
  ],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
})
export class Validation {
  private engine = inject(InventoEngineService);
  private readonly builderState = inject(BuilderState);
  private readonly router = inject(Router);

  businessName = this.builderState.businessName() || 'Malipo';
  businessType = this.builderState.businessType() || 'Inventory Management';
  targetAudience = this.builderState.targetAudience() || 'Small Businesses';

  currentStep: WorkflowStep = 'INPUT';
  buildLogs: string[] = [];

  aiReport: AIAnalysis | null = null;
  domains: DomainResult[] = [];
  finalDeploymentUrl = '';

  // New computed getter to power the Old UI's live validation checklist
  get liveChecks(): { id: number; label: string; passed: boolean }[] {
    const cleaned = (this.businessName || '').trim();
    // Reusing the regex logic from your engine service
    const specialCharRegex = new RegExp('[@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?]');
    const numberRegex = new RegExp('^\\d');

    return [
      {
        id: 1,
        label: 'validation_check_length',
        passed: cleaned.length >= 3 && cleaned.length <= 25,
      },
      {
        id: 2,
        label: 'validation_check_special',
        passed: cleaned.length > 0 && !specialCharRegex.test(cleaned),
      },
      {
        id: 3,
        label: 'validation_check_number',
        passed: cleaned.length > 0 && !numberRegex.test(cleaned),
      },
    ];
  }

  // Derived boolean to lock/unlock the master submit button
  get isFormatValid(): boolean {
    return this.liveChecks.every((check) => check.passed);
  }

  startValidationPipeline(): void {
    if (!this.isFormatValid) return;

    this.currentStep = 'AI_ANALYSIS';
    this.engine.analyzeBrandWithAI(this.businessName, this.businessType).subscribe({
      next: (res) => {
        this.aiReport = res;
        this.currentStep = 'DOMAINS';

        this.engine.checkDomainAvailability(this.businessName).subscribe({
          next: (doms) => {
            this.domains = doms;
            this.currentStep = 'FINAL_REPORT';
          },
        });
      },
    });
  }

  executePublish(): void {
    this.currentStep = 'BUILDING';
    this.buildLogs = [];

    const logsStream = [
      '// [INVENTO-BUILDER]: Extracting client context configuration...',
      '// [COMPILER]: Cloned workspace active clean template structure state',
      '// [JSON]: Patched layout parameters inside static app config directory structures',
      '// [NPM]: Resolving engine dependency manifests (npm install --silent)...',
      '// [ANGULAR]: Executing local optimized tree-shaking compilation step (ng build --configuration production)...',
      '// [DIST]: Bundle assets built out efficiently inside target folder dist/',
      '// [VERCEL-API]: Uploading payload to Edge clusters network layout...',
      '// [MONGODB]: Synced record references to application master records cluster schema',
    ];

    logsStream.forEach((log, index) => {
      setTimeout(
        () => {
          this.buildLogs.push(log);
        },
        (index + 1) * 450,
      );
    });

    this.engine.triggerProductionDeployment({ name: this.businessName }).subscribe({
      next: (output) => {
        this.finalDeploymentUrl = output.url;
        this.currentStep = 'DEPLOYED';
      },
    });
  }

  resetConsole(): void {
    this.currentStep = 'INPUT';
    this.aiReport = null;
    this.domains = [];
    this.buildLogs = [];
  }

  finish() {
    this.builderState.businessName.set(this.businessName);
    this.builderState.businessType.set(this.businessType);
    this.builderState.targetAudience.set(this.targetAudience);
    this.builderState.isNavigating.set(true);
    this.router.navigate(['/build/preview']);
  }
}
