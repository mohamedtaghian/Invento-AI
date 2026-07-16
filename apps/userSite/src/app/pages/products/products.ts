import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../core/service/products.service';
import { SortOption } from '../../core/interface/product.interface';
import {
  FiltersSidebar,
  CategoryFilter,
  ColorFilter,
} from '../../components/products-components/filters-sidebar/filters-sidebar';
import { ProductsToolbar } from '../../components/products-components/products-toolbar/products-toolbar';
import { ProductsGrid } from '../../components/products-components/products-grid/products-grid';
import { Pagination } from '../../components/products-components/pagination/pagination';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FiltersSidebar, ProductsToolbar, ProductsGrid, Pagination],
})
export class Products {
  private readonly _productsService = inject(ProductsService);
  private readonly _allProducts = this._productsService.products;

  protected readonly categories = signal<CategoryFilter[]>([
    { label: 'Smartphones', value: 'smartphones', checked: false },
    { label: 'Laptops & PCs', value: 'laptops', checked: false },
    { label: 'Audio', value: 'audio', checked: false },
    { label: 'Wearables', value: 'wearables', checked: false },
  ]);

  protected readonly colors: ColorFilter[] = [
    { value: 'black', hex: '#111827' },
    { value: 'white', hex: '#ffffff' },
    { value: 'silver', hex: '#9ca3af' },
    { value: 'blue', hex: '#3b82f6' },
    { value: 'red', hex: '#ef4444' },
  ];

  protected readonly selectedColor = signal<string | null>(null);
  protected readonly maxPrice = signal<number>(5000);
  protected readonly sort = signal<SortOption>('recommended');
  protected readonly currentPage = signal<number>(1);
  protected readonly inStock = signal<boolean>(false);
  protected readonly onlyDiscount = signal<boolean>(false);
  protected readonly searchQuery = signal<string>('');

  protected readonly filteredProducts = computed(() => {
    const activeCategories = this.categories()
      .filter((c) => c.checked)
      .map((c) => c.value);
    const color = this.selectedColor();
    const price = this.maxPrice();
    const sortOption = this.sort();
    const stockOnly = this.inStock();
    const discountOnly = this.onlyDiscount();
    const query = this.searchQuery().toLowerCase();

    let result = this._allProducts().filter((product) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(product.category);
      const matchesColor = !color || product.color === color;
      const matchesPrice = product.price <= price;
      const matchesStock = !stockOnly || product.inStock;
      const matchesDiscount = !discountOnly || !!product.discount;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesColor &&
        matchesPrice &&
        matchesStock &&
        matchesDiscount &&
        matchesSearch
      );
    });

    if (sortOption === 'best-seller') {
      return result.filter((p) => p.badge?.toLowerCase().includes('best'));
    }

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return result;
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / PAGE_SIZE)),
  );

  protected readonly pagedProducts = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredProducts().slice(start, start + PAGE_SIZE);
  });

  protected onCategoryToggle(value: string): void {
    this.categories.update((cats) =>
      cats.map((c) => (c.value === value ? { ...c, checked: !c.checked } : c)),
    );
    this.currentPage.set(1);
  }

  protected onColorSelect(value: string): void {
    this.selectedColor.update((current) => (current === value ? null : value));
    this.currentPage.set(1);
  }

  protected onPriceChange(value: number): void {
    this.maxPrice.set(value);
    this.currentPage.set(1);
  }

  protected onSortChange(value: SortOption): void {
    this.sort.set(value);
    this.currentPage.set(1);
  }

  protected onInStockChange(value: boolean): void {
    this.inStock.set(value);
    this.currentPage.set(1);
  }

  protected onDiscountChange(value: boolean): void {
    this.onlyDiscount.set(value);
    this.currentPage.set(1);
  }

  protected onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  protected onClearAll(): void {
    this.categories.update((cats) => cats.map((c) => ({ ...c, checked: false })));
    this.selectedColor.set(null);
    this.maxPrice.set(5000);
    this.sort.set('recommended');
    this.inStock.set(false);
    this.onlyDiscount.set(false);
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  protected onPageChange(page: number): void {
    const direction = page > this.currentPage() ? 'right' : 'left';
    this.currentPage.set(page);

    setTimeout(() => {
      const wrapper = document.querySelector('.products-grid-wrapper') as HTMLElement;
      if (!wrapper) return;
      wrapper.style.animation = 'none';
      void wrapper.offsetHeight;
      wrapper.style.animation =
        direction === 'right'
          ? 'slideInFromRight 0.35s ease-out'
          : 'slideInFromLeft 0.35s ease-out';
    }, 0);
  }
}
