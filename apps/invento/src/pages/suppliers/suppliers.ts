import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideGlobe,
  lucideTruck,
  lucideStar,
  lucideRefreshCw,
  lucideSearch,
  lucideChevronDown,
  lucideChevronUp,
  lucideChevronRight,
  lucidePlus,
  lucideEye,
  lucideX,
  lucideTag,
  lucideBot,
  lucideMessageSquare,
  lucideCheck,
  lucidePackage,
} from '@ng-icons/lucide';
import { HlmCard } from '@spartan/helm/card';
import { HlmButton } from '@spartan/helm/button';
import { HlmBadge } from '@spartan/helm/badge';
import { HlmInput } from '@spartan/helm/input';
import { HlmSeparator } from '@spartan/helm/separator';

export interface SupplierNote {
  id: string;
  authorName: string;
  authorInitials: string;
  date: string;
  content: string;
}

export interface SupplierView {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  rating: number; // 1–5
  categories: string[];
  lastContact: string;
  leadDays: number;
  minOrderValue: number;
  notes: SupplierNote[];
}

type RatingFilter = '' | 'excellent' | 'good' | 'fair' | 'poor';

const MOCK_SUPPLIERS: SupplierView[] = [
  {
    id: '1',
    name: 'Verdant Co.',
    contactPerson: 'Mia Halvorsen',
    email: 'mia@verdantco.com',
    phone: '+1 503 441 8820',
    address: '1240 Pearl St, Portland, OR 97209',
    website: 'verdantco.com',
    rating: 5,
    categories: ['Home Decor', 'Garden', 'Ceramics'],
    lastContact: '17 Jun 2025',
    leadDays: 7,
    minOrderValue: 500,
    notes: [
      {
        id: 'n1',
        authorName: 'Dodo Duck',
        authorInitials: 'CM',
        date: '17 Jun 2025',
        content:
          'Mia confirmed the Q3 ceramic vase restock — 48 units at the usual price. She also mentioned a new earthenware line launching in August.',
      },
      {
        id: 'n2',
        authorName: 'Dodo Duck',
        authorInitials: 'CM',
        date: '2 Jun 2025',
        content:
          'Delivery was 2 days early this cycle. Packaging quality has improved significantly since the bubble wrap upgrade they mentioned in March.',
      },
      {
        id: 'n3',
        authorName: 'James Whitfield',
        authorInitials: 'JW',
        date: '14 May 2025',
        content:
          'Net-30 terms confirmed for orders over $1,000. Asked about consignment for the high-ticket planters — awaiting response.',
      },
    ],
  },
  {
    id: '2',
    name: 'Threadline Mills',
    contactPerson: 'Declan Shaw',
    email: 'declan.shaw@threadlinemills.com',
    phone: '+44 161 980 4412',
    address: '14 Canal St, Manchester, UK M1 3HZ',
    website: 'threadlinemills.com',
    rating: 4,
    categories: ['Textiles', 'Rugs', 'Bedding'],
    lastContact: '10 Jun 2025',
    leadDays: 14,
    minOrderValue: 300,
    notes: [
      {
        id: 'n1',
        authorName: 'Dodo Duck',
        authorInitials: 'CM',
        date: '10 Jun 2025',
        content:
          'New wool throw samples arrived — quality is excellent. Moving forward with the autumn collection order.',
      },
    ],
  },
  {
    id: '3',
    name: 'Kinfolk Leather Works',
    contactPerson: 'Preet Sandhu',
    email: 'preet@kinfolkleather.com',
    phone: '+1 415 672 3309',
    address: '780 Mission St, San Francisco, CA 94103',
    website: 'kinfolkleather.com',
    rating: 5,
    categories: ['Bags', 'Leather Goods', 'Accessories'],
    lastContact: '5 Jun 2025',
    leadDays: 10,
    minOrderValue: 750,
    notes: [
      {
        id: 'n1',
        authorName: 'Dodo Duck',
        authorInitials: 'CM',
        date: '5 Jun 2025',
        content:
          'Confirmed the custom leather tote order. Lead time extended to 10 days due to material sourcing.',
      },
    ],
  },
  {
    id: '4',
    name: 'Amber & Wick Co.',
    contactPerson: 'Solange Tremblay',
    email: 'solange@amberandwick.com',
    phone: '+1 514 893 7752',
    address: '320 Rue de la Commune O, Montreal, QC H2Y 2E1',
    website: 'amberandwick.com',
    rating: 4,
    categories: ['Candles', 'Wellness', 'Fragrance'],
    lastContact: '28 May 2025',
    leadDays: 5,
    minOrderValue: 200,
    notes: [],
  },
  {
    id: '5',
    name: 'NordicCraft Studio',
    contactPerson: 'Erik Lindgren',
    email: 'erik@nordicraft.se',
    phone: '+46 8 555 0199',
    address: 'Södermalm, Stockholm 116 34, Sweden',
    website: 'nordicraft.se',
    rating: 3,
    categories: ['Home Decor', 'Wood Goods', 'Kitchenware'],
    lastContact: '15 May 2025',
    leadDays: 21,
    minOrderValue: 400,
    notes: [],
  },
  {
    id: '6',
    name: 'Bloom & Petal Imports',
    contactPerson: 'Yuki Tanaka',
    email: 'yuki@bloomandpetal.jp',
    phone: '+81 3 5555 0123',
    address: '1-2-3 Omotesando, Shibuya, Tokyo 150-0001',
    website: 'bloomandpetal.jp',
    rating: 2,
    categories: ['Florals', 'Natural Goods', 'Skincare'],
    lastContact: '1 May 2025',
    leadDays: 30,
    minOrderValue: 150,
    notes: [],
  },
];

const ALL_CATEGORIES = [
  'Accessories',
  'Bags',
  'Bedding',
  'Candles',
  'Ceramics',
  'Florals',
  'Fragrance',
  'Garden',
  'Home Decor',
  'Kitchenware',
  'Leather Goods',
  'Metal Goods',
  'Natural Goods',
  'Rugs',
  'Skincare',
  'Textiles',
  'Wellness',
  'Wood Goods',
];

interface AddSupplierDraft {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  rating: number;
  categoriesRaw: string;
  leadDays: string;
  minOrderValue: string;
}

const EMPTY_DRAFT: AddSupplierDraft = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  rating: 5,
  categoriesRaw: '',
  leadDays: '7',
  minOrderValue: '200',
};

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [NgClass, FormsModule, NgIcon, HlmCard, HlmButton, HlmBadge, HlmInput, HlmSeparator],
  providers: [
    provideIcons({
      lucideBuilding2,
      lucideMail,
      lucidePhone,
      lucideMapPin,
      lucideGlobe,
      lucideTruck,
      lucideStar,
      lucideRefreshCw,
      lucideSearch,
      lucideChevronDown,
      lucideChevronUp,
      lucideChevronRight,
      lucidePlus,
      lucideEye,
      lucideX,
      lucideTag,
      lucideBot,
      lucideMessageSquare,
      lucideCheck,
      lucidePackage,
    }),
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Suppliers {
  protected readonly searchQuery = signal('');
  protected readonly ratingFilter = signal<RatingFilter>('');
  protected readonly categoryFilter = signal('');
  protected readonly expandedId = signal<string | null>(null);
  protected readonly ratingsOpen = signal(false);
  protected readonly categoriesOpen = signal(false);

  protected readonly sheetOpen = signal(false);
  protected readonly selectedSupplier = signal<SupplierView | null>(null);
  protected readonly activeTab = signal<'notes' | 'ai'>('notes');
  protected readonly newNote = signal('');

  protected readonly addOpen = signal(false);
  protected readonly draft = signal<AddSupplierDraft>({ ...EMPTY_DRAFT });

  protected readonly allSuppliers = signal<SupplierView[]>(MOCK_SUPPLIERS);
  protected readonly allCategories = ALL_CATEGORIES;

  protected readonly filteredSuppliers = computed(() => {
    let list = this.allSuppliers();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.categories.some((c) => c.toLowerCase().includes(q)),
      );
    }
    const rating = this.ratingFilter();
    if (rating) {
      list = list.filter((s) => this.getRatingLabel(s.rating).toLowerCase() === rating);
    }
    const category = this.categoryFilter();
    if (category) {
      list = list.filter((s) => s.categories.includes(category));
    }
    return list;
  });

  protected readonly kpiStats = computed(() => {
    const suppliers = this.allSuppliers();
    const now = new Date();
    return {
      total: suppliers.length,
      topRated: suppliers.filter((s) => s.rating >= 5).length,
      active: suppliers.filter((s) => {
        const parts = s.lastContact.split(' ');
        const d = new Date(`${parts[0]} ${parts[1]} ${parts[2]}`);
        return (now.getTime() - d.getTime()) / 86_400_000 <= 30;
      }).length,
      awaitingReply: 1,
    };
  });

  protected readonly draftValid = computed(() => this.draft().name.trim().length > 0);

  protected getRatingLabel(rating: number): string {
    if (rating >= 5) return 'Excellent';
    if (rating >= 4) return 'Good';
    if (rating >= 3) return 'Fair';
    return 'Poor';
  }

  protected getRatingColorClass(rating: number): string {
    if (rating >= 5) return 'text-emerald-600 dark:text-emerald-400';
    if (rating >= 4) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  }

  protected getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  protected getRatingFilterLabel(): string {
    const r = this.ratingFilter();
    if (!r) return 'All Ratings';
    return r.charAt(0).toUpperCase() + r.slice(1);
  }

  protected getCategoryFilterLabel(): string {
    return this.categoryFilter() || 'All Categories';
  }

  protected toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  protected selectRating(rating: RatingFilter): void {
    this.ratingFilter.set(rating);
    this.ratingsOpen.set(false);
  }

  protected selectCategory(category: string): void {
    this.categoryFilter.set(category);
    this.categoriesOpen.set(false);
  }

  protected openSheet(supplier: SupplierView): void {
    this.selectedSupplier.set(supplier);
    this.sheetOpen.set(true);
    this.activeTab.set('notes');
    this.newNote.set('');
  }

  protected closeSheet(): void {
    this.sheetOpen.set(false);
  }

  protected setActiveTab(tab: 'notes' | 'ai'): void {
    this.activeTab.set(tab);
  }

  protected addNote(): void {
    const content = this.newNote().trim();
    if (!content) return;
    const supplier = this.selectedSupplier();
    if (!supplier) return;
    const note: SupplierNote = {
      id: Date.now().toString(),
      authorName: 'Dodo Duck',
      authorInitials: 'CM',
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      content,
    };
    const updated: SupplierView = { ...supplier, notes: [note, ...supplier.notes] };
    this.selectedSupplier.set(updated);
    this.allSuppliers.update((list) => list.map((s) => (s.id === updated.id ? updated : s)));
    this.newNote.set('');
  }

  protected openAdd(): void {
    this.draft.set({ ...EMPTY_DRAFT });
    this.addOpen.set(true);
  }

  protected closeAdd(): void {
    this.addOpen.set(false);
  }

  protected setDraftRating(r: number): void {
    this.draft.update((d) => ({ ...d, rating: r }));
  }

  protected patchDraft(field: keyof AddSupplierDraft, value: string): void {
    this.draft.update((d) => ({ ...d, [field]: value }));
  }

  protected submitAdd(): void {
    const d = this.draft();
    if (!d.name.trim()) return;
    const newSupplier: SupplierView = {
      id: Date.now().toString(),
      name: d.name.trim(),
      contactPerson: d.contactPerson.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      address: d.address.trim(),
      website: d.website.trim(),
      rating: d.rating,
      categories: d.categoriesRaw
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      lastContact: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      leadDays: parseInt(d.leadDays) || 7,
      minOrderValue: parseInt(d.minOrderValue) || 200,
      notes: [],
    };
    this.allSuppliers.update((list) => [newSupplier, ...list]);
    this.addOpen.set(false);
  }
}
