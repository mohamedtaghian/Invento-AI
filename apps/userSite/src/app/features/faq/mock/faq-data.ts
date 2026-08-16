import type { FaqItem } from '../types/faq';

export const MOCK_FAQS: FaqItem[] = [
  {
    question: 'How long does delivery take?',
    answer: `Cairo and Giza: 1–2 working days.
Other governorates: 3–5 working days.
You get a tracking number by email once the order leaves our workshop.`,
  },
  {
    question: 'Can I return an item that does not fit?',
    answer:
      'Yes — unworn items with their tags on can be returned within 14 days of delivery. Made-to-measure pieces are the one exception.',
  },
  {
    question: 'كيف أختار المقاس المناسب؟',
    answer: 'كل منتج يحتوي على جدول مقاسات بالسنتيمتر. لو كنت بين مقاسين، اختاري الأكبر.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept Visa, Mastercard, Cash on Delivery, and electronic wallets. All online transactions are processed through secure payment gateways.',
  },
];
