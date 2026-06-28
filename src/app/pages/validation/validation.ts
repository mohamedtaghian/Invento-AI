import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideGlobe,
  lucideAlertTriangle,
  lucideCheckCircle2,
  lucideSearch,
  lucideLoader2,
} from '@ng-icons/lucide';

import { HlmLabel } from '@spartan/helm/label';

interface ValidationRule {
  id: string;
  label: string;
  passed: boolean;
}

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, HlmLabel],
  providers: [
    provideIcons({
      lucideGlobe,
      lucideAlertTriangle,
      lucideCheckCircle2,
      lucideSearch,
      lucideLoader2,
    }),
  ],
  templateUrl: './validation.html',
  styleUrl: './validation.css',
})
export class Validation {
  brandName = '';
  tagline = '';

  validationChecks: ValidationRule[] = [
    { id: 'length', label: 'Name length (3–24 chars)', passed: false },
    { id: 'reserved', label: 'No reserved system keywords', passed: true },
    { id: 'trademark', label: 'Global Trademark clearing database', passed: true },
    { id: 'domain', label: '.com domain namespace availability', passed: false },
    { id: 'social', label: 'Social handle validation (@brand)', passed: true },
  ];

  updateChecks() {
    const cleaned = this.brandName.trim();
    this.validationChecks[0].passed = cleaned.length >= 3 && cleaned.length <= 24;
    this.validationChecks[3].passed = cleaned.length % 2 === 0;
  }
}
