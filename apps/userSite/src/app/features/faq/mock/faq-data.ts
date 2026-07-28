import type { FaqCategory } from '../types/faq';

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    icon: 'lucideHelpCircle',
    items: [
      {
        question: 'What is this store about?',
        answer:
          'We are a premium online electronics store offering the latest in technology — from laptops and headphones to smartwatches and cameras. Every product is handpicked for quality and value.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click the user icon in the top navigation bar and select "Sign Up." Fill in your details and you\'re ready to shop. You can also sign in with Google for a faster experience.',
      },
      {
        question: 'Do you have a physical store?',
        answer:
          'We operate exclusively online to keep costs low and pass the savings on to you. Our digital-first approach means faster updates, better prices, and a wider selection.',
      },
      {
        question: 'What are your operating hours?',
        answer:
          'Our website is available 24/7. Customer support is available Monday through Friday, 9 AM – 6 PM (EST). You can also reach us via the chatbot anytime.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders & Products',
    icon: 'lucidePackage',
    items: [
      {
        question: 'How do I track my order?',
        answer:
          'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also check the status in your account under "My Orders."',
      },
      {
        question: 'Can I cancel or modify my order?',
        answer:
          'You can cancel or modify your order within 1 hour of placing it. After that, the order enters processing and changes may not be possible. Contact support for urgent requests.',
      },
      {
        question: 'Are your products authentic?',
        answer:
          'Absolutely. We source all products directly from manufacturers or authorized distributors. Every item comes with a manufacturer warranty and a certificate of authenticity where applicable.',
      },
      {
        question: 'What if my item arrives damaged?',
        answer:
          "We're sorry to hear that! Please contact our support team within 48 hours of delivery with photos of the damage. We'll arrange a free replacement or full refund.",
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    icon: 'lucideTruck',
    items: [
      {
        question: 'What are the shipping options?',
        answer:
          'We offer Standard (5-7 business days), Express (2-3 business days), and Next-Day delivery. Shipping costs vary by location and are calculated at checkout.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          "Yes! We ship to over 50 countries. International shipping typically takes 7-14 business days. Import duties and taxes may apply and are the buyer's responsibility.",
      },
      {
        question: 'Is free shipping available?',
        answer:
          'Orders over $99 qualify for free standard shipping within the continental US. Keep an eye on seasonal promotions for free express shipping offers.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: 'lucideCreditCard',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are processed through secure, PCI-compliant payment gateways.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Absolutely. We use 256-bit SSL encryption and never store your full card details on our servers. All payment processing is handled by industry-leading providers.',
      },
      {
        question: 'Do you offer installment plans?',
        answer:
          'Yes! For orders over $200, you can split your payment into 4 interest-free installments via our partner. Select "Pay in 4" at checkout.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Warranty',
    icon: 'lucideShield',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 30-day hassle-free return policy. Items must be in original condition with all packaging. Refunds are processed within 5-7 business days after we receive the return.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Go to "My Orders" in your account, select the item, and click "Request Return." You\'ll receive a prepaid shipping label via email within 24 hours.',
      },
      {
        question: 'What does the warranty cover?',
        answer:
          'All products come with a minimum 1-year manufacturer warranty covering defects in materials and workmanship. Extended warranty plans are available at checkout for select items.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    icon: 'lucideHeadphones',
    items: [
      {
        question: 'How can I contact customer support?',
        answer:
          'You can reach us via the live chatbot on this site, email us at support@store.com, or call us at 1-800-TECH-HELP during business hours.',
      },
      {
        question: 'How fast will I get a response?',
        answer:
          'Chatbot responses are instant. Email inquiries are typically answered within 4-6 hours during business days. Phone support has an average wait time of under 2 minutes.',
      },
      {
        question: 'Can I request a product that is out of stock?',
        answer:
          'Yes! Use the "Notify Me" button on any out-of-stock product page. We\'ll email you as soon as it\'s back in stock. You can also contact support for estimated restock dates.',
      },
    ],
  },
];
