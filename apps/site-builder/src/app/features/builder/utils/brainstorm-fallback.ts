import type { BrainstormResponse } from '@/app/features/builder/services/brainstorm-api';

/**
 * Offline stand-in for the brainstorm endpoint.
 *
 * When the AI service is unreachable we still want the interview step to open
 * with sensible pre-filled answers rather than a blank form, so this derives a
 * best-effort profile from keywords in the user's own description. Pure and
 * synchronous — the service wraps it in an Observable.
 */
export function analyzePromptLocally(prompt: string): BrainstormResponse {
  const p = prompt.toLowerCase();

  return {
    isFallback: true,
    questions: [
      { questionId: 'q1', answer: extractName(prompt) },
      { questionId: 'q2', answer: matchCategory(p).category },
      { questionId: 'q3', answer: matchCategory(p).audience },
      { questionId: 'q4', answer: firstMatch(p, PRICE_POINTS, 'Mid-range') },
      { questionId: 'q5', answer: firstMatch(p, BRAND_TONES, 'Energetic') },
      { questionId: 'q6', answer: firstMatch(p, BUSINESS_MODELS, 'Physical') },
      { questionId: 'q7', answer: firstMatch(p, COLOR_PALETTES, 'Blue') },
    ],
  };
}

interface Rule {
  readonly value: string;
  readonly pattern: RegExp;
}

/** Returns the first rule whose pattern matches, else `fallback`. Order is priority. */
function firstMatch(prompt: string, rules: readonly Rule[], fallback: string): string {
  return rules.find((r) => r.pattern.test(prompt))?.value ?? fallback;
}

const PRICE_POINTS: readonly Rule[] = [
  { value: 'Budget', pattern: /\b(budget|affordable|cheap|low cost)\b/i },
  { value: 'Luxury', pattern: /\b(luxury|high-end|exclusive|expensive)\b/i },
  { value: 'Premium', pattern: /\b(premium)\b/i },
  { value: 'Mid-range', pattern: /\b(mid-range|moderate|balanced)\b/i },
];

const BRAND_TONES: readonly Rule[] = [
  { value: 'Calm', pattern: /\b(calm|peaceful|relaxing|serene|tranquil)\b/i },
  { value: 'Elegant', pattern: /\b(elegant|luxurious|chic|sophisticated)\b/i },
  { value: 'Playful', pattern: /\b(playful|fun|cheerful|friendly)\b/i },
  { value: 'Energetic', pattern: /\b(energetic|motivating|bold|active|dynamic)\b/i },
];

const BUSINESS_MODELS: readonly Rule[] = [
  { value: 'Both', pattern: /\b(both|physical and digital|digital and physical)\b/i },
  { value: 'Digital', pattern: /\b(digital|saas|software|downloadable|online course|ebook)\b/i },
  { value: 'Physical', pattern: /\b(physical|equipment|bands|products|clothing|goods|hardware)\b/i },
];

const COLOR_PALETTES: readonly Rule[] = [
  { value: 'Red', pattern: /\b(red)\b/i },
  { value: 'Blue', pattern: /\b(blue)\b/i },
  { value: 'Green', pattern: /\b(green)\b/i },
  { value: 'Yellow', pattern: /\b(yellow)\b/i },
  { value: 'Purple', pattern: /\b(purple)\b/i },
  { value: 'Orange', pattern: /\b(orange)\b/i },
  { value: 'Pink', pattern: /\b(pink)\b/i },
  { value: 'Neutral', pattern: /\b(neutral|black|white|grey|gray)\b/i },
];

interface CategoryRule extends Rule {
  readonly audience: string;
  /** Narrower audience when the prompt also mentions beginners. */
  readonly beginnerAudience?: string;
}

const CATEGORIES: readonly CategoryRule[] = [
  {
    value: 'Health & Fitness',
    audience: 'Gym Enthusiasts & Active Adults',
    beginnerAudience: 'Fitness Beginners & Enthusiasts',
    pattern:
      /\b(gym|fitness|workout|workout equipment|resistance bands|sportswear|training|exercise|health|wellness)\b/i,
  },
  {
    value: 'Technology & Software',
    audience: 'Tech-Savvy Professionals (22–45)',
    pattern: /\b(tech|technology|software|apps?|artificial intelligence|digital|code|cloud|saas)\b/i,
  },
  {
    value: 'Food & Beverage',
    audience: 'Food Lovers & Local Community',
    pattern: /\b(coffee|cafe|food|restaurant|bakery|dining|bites|kitchen|drinks|beverage)\b/i,
  },
  {
    value: 'Fashion & Apparel',
    audience: 'Style Enthusiasts (18–35)',
    pattern: /\b(fashion|clothes|store|apparel|wear|shoes|boutique|style|jewelry|accessories)\b/i,
  },
  {
    value: 'Creative & Design Services',
    audience: 'Businesses & Entrepreneurs',
    pattern: /\b(design|agency|creative|marketing|studio|media|services)\b/i,
  },
];

function matchCategory(prompt: string): { category: string; audience: string } {
  const hit = CATEGORIES.find((c) => c.pattern.test(prompt));
  if (!hit) return { category: 'General Business', audience: 'General Public (18–65)' };

  const audience =
    hit.beginnerAudience && prompt.includes('beginner') ? hit.beginnerAudience : hit.audience;
  return { category: hit.value, audience };
}

/**
 * Best-effort brand name from the description: a leading quoted phrase, a
 * subject preceding a descriptive verb ("Acme sells..."), else the first word.
 */
function extractName(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return 'My Brand';

  const quoted = trimmed.match(/^["'“”«`]([^"'“”»`]+)["'“”»`]/);
  if (quoted?.[1]) return quoted[1].trim();

  const beforeVerb = trimmed.match(
    /^([A-Z0-9_&-]{2,30})\s+(is|offers|provides|sells|builds|creates|delivers|specializes|-|:)/i,
  );
  if (beforeVerb?.[1]) return beforeVerb[1].trim();

  const firstWord = trimmed.split(/\s+/)[0];
  if (firstWord && firstWord.length <= 30) {
    return firstWord.replace(/[^a-zA-Z0-9_-]/g, '') || 'My Brand';
  }

  return 'My Brand';
}
