// ai-advisor-panel.ts
import { Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan/helm/button';
import { HlmSheetImports } from '@spartan/helm/sheet';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSparkles, lucideExternalLink, lucideMail, lucideArrowRight } from '@ng-icons/lucide';
import { RestockRecommendation } from '@invento/invento/shared/ai-advisor.types';
import { RestockAdvisorService, RecommendationFilter } from '../services/restock-advisor.service';

@Component({
  selector: 'app-ai-advisor-panel',
  imports: [HlmButtonImports, HlmSheetImports, HlmBadgeImports, NgIcon],
  providers: [provideIcons({ lucideSparkles, lucideExternalLink, lucideMail, lucideArrowRight })],
  templateUrl: './ai-advisor-panel.html',
})
export class AiAdvisorPanel {
  private advisorService = inject(RestockAdvisorService);

  recommendations = this.advisorService.recommendations;
  data = this.advisorService.data;
  count = this.advisorService.count;
  activeFilter = this.advisorService.filter;

  setFilter(filter: RecommendationFilter) {
    this.advisorService.setFilter(filter);
  }

  urgencyLabel(u: RestockRecommendation['urgency']): string {
    return u === 'critical' ? 'Critical' : u === 'watch' ? 'Watch' : 'Healthy';
  }

  draftReorderEmail(item: RestockRecommendation) {
    console.log('Draft reorder email for', item.sku);
  }
}
