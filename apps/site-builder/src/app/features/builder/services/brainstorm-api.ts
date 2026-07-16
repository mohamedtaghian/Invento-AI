import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface BrainstormResponse {
  business_name?: string;
  business_type?: string;
  industry?: string;
  target?: string;
  pricing?: string;
  channels?: string[];
  differentiator?: string;
  recommendations?: string[];
}

@Injectable({ providedIn: 'root' })
export class BrainstormApi {
  analyzePrompt(prompt: string): Observable<BrainstormResponse> {
    return of({
      business_name: this.extractName(prompt),
      business_type: 'E-Commerce (Physical)',
      industry: 'Fashion & Apparel',
      target: 'Millennials (25–40)',
      pricing: 'Premium ($100–$500)',
      channels: ['DTC Website', 'Social Commerce'],
      differentiator: 'Design / Aesthetics',
      recommendations: [
        'Consider adding a subscription model for recurring revenue.',
        'Your brand could benefit from a loyalty program.',
      ],
    }).pipe(delay(800));
  }

  private extractName(prompt: string): string {
    const lines = prompt.split('\n').filter((l) => l.trim());
    const firstLine = lines[0]?.trim() || '';
    const nameMatch = firstLine.match(/^["""]([^"""]+)["""]/);
    if (nameMatch) return nameMatch[1];
    const words = firstLine.split(/\s+/);
    return words.slice(0, 2).join(' ') || 'My Brand';
  }
}
