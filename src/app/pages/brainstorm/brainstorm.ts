import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBadgeImports } from '../../../../libs/ui/badge/src';
import { HlmTextareaImports } from '../../../../libs/ui/textarea/src';
import { HlmItemImports } from '../../../../libs/ui/item/src';
import { HlmButtonImports } from '../../../../libs/ui/button/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBolt, heroArrowRight } from '@ng-icons/heroicons/outline';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  ],
  templateUrl: './brainstorm.html',
  styleUrl: './brainstorm.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroBolt, heroArrowRight })],
})
export class Brainstorm {
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

  descriptionControl: FormControl = new FormControl('');
}
