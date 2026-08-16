import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideSearch,
  lucideChevronRight,
  lucidePlus,
  lucideX,
  lucideAlertCircle,
  lucideLoader2,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

import { ApiProductListItem, PaginatedResponse, CreateProductDto, CreateProductVariantDto } from '../../features/products/product.model';
import { ProductService } from '../../features/products/product.service';
import { AttributeService } from '../../features/attributes/attribute.service';
import { ProductAttribute } from '../../features/attributes/attribute.model';

interface FormVariant {
  colorValueId: string;
  sizeValueId: string;
  sku: string;
  price: number | null;
  stock: number | null;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    NgClass,
    FormsModule,
    NgIcon,
    HlmButton,
    HlmCardImports,
    HlmInputImports,
    CdkDropList,
    CdkDrag
  ],
  providers: [
    provideIcons({
      lucideDownload,
      lucideSearch,
      lucideChevronRight,
      lucidePlus,
      lucideX,
      lucideAlertCircle,
      lucideLoader2,
    }),
  ],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly attributeService = inject(AttributeService);
  private readonly router = inject(Router);

  readonly isDrawerOpen = signal(false);

  readonly products = signal<ApiProductListItem[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly totalProducts = signal<number>(0);

  readonly attributes = signal<ProductAttribute[]>([]);
  readonly colorAttribute = computed(() => this.attributes().find(a => a.name.toLowerCase() === 'color' || a.key.toLowerCase() === 'color'));
  readonly sizeAttribute = computed(() => this.attributes().find(a => a.name.toLowerCase() === 'size' || a.key.toLowerCase() === 'size'));

  // New product form model
  newProduct = {
    title: '',
    variants: [
      { colorValueId: '', sizeValueId: '', sku: '', price: null, stock: null } as FormVariant
    ]
  };
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchAttributes();
  }

  fetchAttributes(): void {
    this.attributeService.getAttributes().subscribe({
      next: (attrs) => this.attributes.set(attrs),
      error: (err) => console.error('Failed to load attributes', err),
    });
  }

  fetchProducts(): void {
    this.isLoading.set(true);

    this.productService.getProducts().subscribe({
      next: (response: PaginatedResponse<ApiProductListItem>) => {
        this.products.set(response.items);
        this.totalProducts.set(response.total);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      },
    });
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update((v) => !v);
    if (!this.isDrawerOpen()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newProduct = { 
      title: '', 
      variants: [{ colorValueId: '', sizeValueId: '', sku: '', price: null, stock: null }]
    };
  }

  addVariant(): void {
    this.newProduct.variants.push({ colorValueId: '', sizeValueId: '', sku: '', price: null, stock: null });
  }

  removeVariant(index: number): void {
    if (this.newProduct.variants.length > 1) {
      this.newProduct.variants.splice(index, 1);
    }
  }

  submitProduct(): void {
    if (!this.newProduct.title || this.newProduct.variants.length === 0) return;
    
    // Ensure all variants have sku and price
    const isValid = this.newProduct.variants.every(v => v.sku && v.price != null);
    if (!isValid) return;

    this.isSubmitting.set(true);
    
    const apiVariants: CreateProductVariantDto[] = this.newProduct.variants.map(v => {
      const attributeValueIds = [];
      if (v.colorValueId) attributeValueIds.push(v.colorValueId);
      if (v.sizeValueId) attributeValueIds.push(v.sizeValueId);

      return {
        sku: v.sku,
        priceAmount: Math.round((v.price || 0) * 100), // convert to minor units
        stockQuantity: v.stock || 0,
        attributeValueIds: attributeValueIds.length > 0 ? attributeValueIds : undefined
      };
    });

    const payload: CreateProductDto = {
      title: this.newProduct.title,
      variants: apiVariants
    };

    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toggleDrawer();
        this.fetchProducts(); // refresh the list
      },
      error: (err) => {
        console.error('Failed to create product', err);
        this.isSubmitting.set(false);
      }
    });
  }

  drop(event: CdkDragDrop<ApiProductListItem[]>): void {
    const currentProducts = [...this.products()];
    moveItemInArray(currentProducts, event.previousIndex, event.currentIndex);
    this.products.set(currentProducts);

    // Save reorder
    const items = currentProducts.map((p, i) => ({ id: p.id, position: i }));
    this.productService.reorderProducts(items).subscribe({
      error: (err) => {
        console.error('Failed to save order', err);
        this.fetchProducts(); // revert on error
      }
    });
  }

  viewProductDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }
}
