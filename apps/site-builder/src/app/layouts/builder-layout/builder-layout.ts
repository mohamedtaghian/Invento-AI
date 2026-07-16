import { Component, inject } from '@angular/core';
import { StepsBar } from '../../components/steps-bar/steps-bar';
import { RouterOutlet } from '@angular/router';
import { AiLoader } from '@/app/components/ai-loader/ai-loader';
import { BuilderState } from '@/app/features/builder/services/builder-state';

@Component({
  selector: 'app-builder-layout',
  imports: [StepsBar, RouterOutlet, AiLoader],
  templateUrl: './builder-layout.html',
  styleUrl: './builder-layout.css',
})
export class BuilderLayout {
  protected readonly builderState = inject(BuilderState);
}
