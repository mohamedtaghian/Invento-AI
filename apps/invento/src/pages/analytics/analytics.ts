import { Component } from '@angular/core';
import { AiAdvisorPanel } from '@invento/invento/features/ai-advisor';

@Component({
  selector: 'app-analytics',
  imports: [AiAdvisorPanel],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {}
