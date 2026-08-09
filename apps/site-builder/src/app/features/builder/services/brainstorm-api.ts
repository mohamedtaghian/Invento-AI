import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

export interface BrainstormResponse {
  questions: {
    questionId: string;
    answer: string | null;
  }[];
}

declare const process: { env?: Record<string, string | undefined> };

@Injectable({ providedIn: 'root' })
export class BrainstormApi {
  private readonly http = inject(HttpClient);

  analyzePrompt(prompt: string, logo?: File): Observable<BrainstormResponse> {
    const apiUrl = this.getApiUrl();
    const apiKey = this.getApiKey();

    const baseUrl = apiUrl ? apiUrl.replace(/\/+$/, '') : '';
    const endpoint = baseUrl ? `${baseUrl}/site-builder/brainstorm` : '/site-builder/brainstorm';

    const formData = new FormData();
    formData.append('brainstorm', prompt);
    if (logo) {
      formData.append('logo', logo);
    }

    let headers = new HttpHeaders();
    if (apiKey) {
      headers = headers.set('Authorization', `Bearer ${apiKey}`);
    }

    return this.http.post<BrainstormResponse>(endpoint, formData, { headers }).pipe(
      catchError((err) => {
        console.warn('API call failed or unavailable, using smart prompt analyzer:', err);
        return this.getMockResponse(prompt);
      }),
    );
  }

  private getApiUrl(): string {
    if (typeof process !== 'undefined' && process.env?.['INVENTO_API_URL']) {
      return process.env['INVENTO_API_URL'];
    }
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w['INVENTO_API_URL'] === 'string') return w['INVENTO_API_URL'];
      const envObj = w['__ENV__'] as Record<string, string> | undefined;
      if (envObj?.['INVENTO_API_URL']) return envObj['INVENTO_API_URL'];
    }
    const g = globalThis as unknown as Record<string, unknown>;
    return typeof g['INVENTO_API_URL'] === 'string' ? g['INVENTO_API_URL'] : '';
  }

  private getApiKey(): string {
    if (typeof process !== 'undefined' && process.env?.['INVENTO_API_KEY']) {
      return process.env['INVENTO_API_KEY'];
    }
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w['INVENTO_API_KEY'] === 'string') return w['INVENTO_API_KEY'];
      const envObj = w['__ENV__'] as Record<string, string> | undefined;
      if (envObj?.['INVENTO_API_KEY']) return envObj['INVENTO_API_KEY'];
    }
    const g = globalThis as unknown as Record<string, unknown>;
    return typeof g['INVENTO_API_KEY'] === 'string' ? g['INVENTO_API_KEY'] : '';
  }

  private getMockResponse(prompt: string): Observable<BrainstormResponse> {
    const p = prompt.toLowerCase();
    const name = this.extractName(prompt);

    let category = 'General Business';
    let targetAudience = 'General Public (18–65)';
    let pricePoint = 'Mid-range';
    let brandTone = 'Energetic';
    let businessModel = 'Physical';
    let colorPalette = 'Blue';

    // 1. Category extraction (strictly using word boundaries \b to avoid substrings matching like 'maintain' -> 'ai')
    if (
      /\b(gym|fitness|workout|workout equipment|resistance bands|sportswear|training|exercise|health|wellness)\b/i.test(
        p,
      )
    ) {
      category = 'Health & Fitness';
      targetAudience = p.includes('beginner')
        ? 'Fitness Beginners & Enthusiasts'
        : 'Gym Enthusiasts & Active Adults';
    } else if (
      /\b(tech|technology|software|apps?|artificial intelligence|digital|code|cloud|saas)\b/i.test(
        p,
      )
    ) {
      category = 'Technology & Software';
      targetAudience = 'Tech-Savvy Professionals (22–45)';
    } else if (
      /\b(coffee|cafe|food|restaurant|bakery|dining|bites|kitchen|drinks|beverage)\b/i.test(p)
    ) {
      category = 'Food & Beverage';
      targetAudience = 'Food Lovers & Local Community';
    } else if (
      /\b(fashion|clothes|store|apparel|wear|shoes|boutique|style|jewelry|accessories)\b/i.test(p)
    ) {
      category = 'Fashion & Apparel';
      targetAudience = 'Style Enthusiasts (18–35)';
    } else if (/\b(design|agency|creative|marketing|studio|media|services)\b/i.test(p)) {
      category = 'Creative & Design Services';
      targetAudience = 'Businesses & Entrepreneurs';
    }

    // 2. Price point extraction
    if (/\b(budget|affordable|cheap|low cost)\b/i.test(p)) {
      pricePoint = 'Budget';
    } else if (/\b(luxury|high-end|exclusive|expensive)\b/i.test(p)) {
      pricePoint = 'Luxury';
    } else if (/\b(premium)\b/i.test(p)) {
      pricePoint = 'Premium';
    } else if (/\b(mid-range|moderate|balanced)\b/i.test(p)) {
      pricePoint = 'Mid-range';
    }

    // 3. Brand tone / personality extraction
    if (/\b(calm|peaceful|relaxing|serene|tranquil)\b/i.test(p)) {
      brandTone = 'Calm';
    } else if (/\b(elegant|luxurious|chic|sophisticated)\b/i.test(p)) {
      brandTone = 'Elegant';
    } else if (/\b(playful|fun|cheerful|friendly)\b/i.test(p)) {
      brandTone = 'Playful';
    } else if (/\b(energetic|motivating|bold|active|dynamic)\b/i.test(p)) {
      brandTone = 'Energetic';
    }

    // 4. Business model / Product type extraction
    if (/\b(both|physical and digital|digital and physical)\b/i.test(p)) {
      businessModel = 'Both';
    } else if (/\b(digital|saas|software|downloadable|online course|ebook)\b/i.test(p)) {
      businessModel = 'Digital';
    } else if (/\b(physical|equipment|bands|products|clothing|goods|hardware)\b/i.test(p)) {
      businessModel = 'Physical';
    }

    // 5. Preferred color extraction
    if (/\b(red)\b/i.test(p)) colorPalette = 'Red';
    else if (/\b(blue)\b/i.test(p)) colorPalette = 'Blue';
    else if (/\b(green)\b/i.test(p)) colorPalette = 'Green';
    else if (/\b(yellow)\b/i.test(p)) colorPalette = 'Yellow';
    else if (/\b(purple)\b/i.test(p)) colorPalette = 'Purple';
    else if (/\b(orange)\b/i.test(p)) colorPalette = 'Orange';
    else if (/\b(pink)\b/i.test(p)) colorPalette = 'Pink';
    else if (/\b(neutral|black|white|grey|gray)\b/i.test(p)) colorPalette = 'Neutral';

    return of({
      questions: [
        { questionId: 'q1', answer: name },
        { questionId: 'q2', answer: category },
        { questionId: 'q3', answer: targetAudience },
        { questionId: 'q4', answer: pricePoint },
        { questionId: 'q5', answer: brandTone },
        { questionId: 'q6', answer: businessModel },
        { questionId: 'q7', answer: colorPalette },
      ],
    });
  }

  private extractName(prompt: string): string {
    const trimmed = prompt.trim();
    if (!trimmed) return 'My Brand';

    // 1. Quoted brand name, e.g. "PulseFit"
    const quoteMatch = trimmed.match(/^["'""«`]([^"'""»`]+)["'""»`]/);
    if (quoteMatch && quoteMatch[1]) return quoteMatch[1].trim();

    // 2. Verb match, e.g. "PulseFit is a..." or "PulseFit offers..."
    const verbMatch = trimmed.match(
      /^([A-Z0-9_&-]{2,30})\s+(is|offers|provides|sells|builds|creates|delivers|specializes|-|:)/i,
    );
    if (verbMatch && verbMatch[1]) return verbMatch[1].trim();

    // 3. Fallback to first single word
    const firstWord = trimmed.split(/\s+/)[0];
    if (firstWord && firstWord.length <= 30) {
      return firstWord.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    return 'My Brand';
  }
}
