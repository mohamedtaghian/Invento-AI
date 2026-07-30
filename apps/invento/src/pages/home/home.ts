import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideImage,
  lucideUpload,
  lucideLayoutGrid,
  lucideFolderTree,
  lucideChevronDown,
  lucideChevronUp,
  lucideChevronRight,
  lucideCheckCircle2,
  lucidePackage,
  lucideCheck,
  lucideGlobe,
  lucideMonitor,
  lucideSmartphone,
  lucideExternalLink,
  lucideShoppingCart,
  lucideTrash2,
  lucidePlus,
} from '@ng-icons/lucide';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
  selected: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [
    provideIcons({
      lucideImage,
      lucideUpload,
      lucideLayoutGrid,
      lucideFolderTree,
      lucideChevronDown,
      lucideChevronUp,
      lucideChevronRight,
      lucideCheckCircle2,
      lucidePackage,
      lucideCheck,
      lucideGlobe,
      lucideMonitor,
      lucideSmartphone,
      lucideExternalLink,
      lucideShoppingCart,
      lucideTrash2,
      lucidePlus,
    }),
  ],
})
export class HomeComponent {
  // View mode & UI States -> categoryPickerOpen is now false by default
  viewMode = signal<'desktop' | 'mobile'>('desktop');
  categoryPickerOpen = signal<boolean>(false);
  productPickerOpen = signal<boolean>(false);
  isSaved = signal<boolean>(false);

  // Hero Section State
  heroImageUrl = signal<string>(
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
  );
  heroTitle = signal<string>('Elevate Your Daily Tech Setup');
  heroSubtitle = signal<string>(
    'Discover premium accessories designed for minimalist productivity & peak performance.',
  );

  // Categories Section State
  categoriesTitle = signal<string>('Categories');
  categories = signal<Category[]>([
    { id: '1', name: 'Laptops', icon: '💻' },
    { id: '2', name: 'Audio', icon: '🎧' },
    { id: '3', name: 'Mobile', icon: '📱' },
    { id: '4', name: 'Wearables', icon: '⌚' },
    { id: '5', name: 'Cameras', icon: '📷' },
    { id: '6', name: 'Networking', icon: '🌐' },
  ]);

  // Products Section State
  featuredTitle = signal<string>('Featured Products');
  products = signal<Product[]>([
    {
      id: 'p1',
      name: 'AuraX Pro ANC',
      price: '$299',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
      selected: true,
    },
    {
      id: 'p2',
      name: 'Nexus Book 16"',
      price: '$1299',
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
      selected: true,
    },
    {
      id: 'p3',
      name: 'Chronos Smartwatch',
      price: '$349',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
      selected: true,
    },
    {
      id: 'p4',
      name: 'Tactile Pro Keyboard',
      price: '$149',
      img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400&auto=format&fit=crop',
      selected: true,
    },
  ]);

  // Computed Properties
  selectedProducts = computed(() => this.products().filter((product) => product.selected));

  // View Mode Handler
  setViewMode(mode: 'desktop' | 'mobile') {
    this.viewMode.set(mode);
  }

  // Hero Section Handlers
  onHeroTitleChange(title: string) {
    this.heroTitle.set(title);
    this.isSaved.set(false);
  }

  onHeroSubtitleChange(subtitle: string) {
    this.heroSubtitle.set(subtitle);
    this.isSaved.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.heroImageUrl.set(reader.result as string);
        this.isSaved.set(false);
      };
      reader.readAsDataURL(file);
    }
  }

  // Categories Handlers
  onCategoriesTitleChange(title: string) {
    this.categoriesTitle.set(title);
    this.isSaved.set(false);
  }

  updateCategoryIcon(id: string, icon: string) {
    this.categories.update((cats) => cats.map((c) => (c.id === id ? { ...c, icon } : c)));
    this.isSaved.set(false);
  }

  updateCategoryName(id: string, name: string) {
    this.categories.update((cats) => cats.map((c) => (c.id === id ? { ...c, name } : c)));
    this.isSaved.set(false);
  }

  addCategory() {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'New Category',
      icon: '✨',
    };
    this.categories.update((cats) => [...cats, newCategory]);
    this.isSaved.set(false);
  }

  removeCategory(id: string) {
    this.categories.update((cats) => cats.filter((cat) => cat.id !== id));
    this.isSaved.set(false);
  }

  // Products Handlers
  onFeaturedTitleChange(title: string) {
    this.featuredTitle.set(title);
    this.isSaved.set(false);
  }

  toggleProduct(id: string) {
    this.products.update((items) =>
      items.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)),
    );
    this.isSaved.set(false);
  }

  // Actions
  fallbackImg(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400&auto=format&fit=crop';
  }

  discard() {
    this.isSaved.set(true);
  }

  openLive() {
    window.open('https://yourbrand.com', '_blank');
  }

  saveChanges() {
    this.isSaved.set(true);
  }
}
