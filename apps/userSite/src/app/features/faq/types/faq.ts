export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqCategory {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly items: readonly FaqItem[];
}
