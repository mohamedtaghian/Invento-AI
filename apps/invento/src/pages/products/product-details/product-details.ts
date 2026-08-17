import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucidePackage,
  lucideTag,
  lucideLoader2,
  lucideTrash2,
  lucideEdit,
  lucideX,
  lucideUpload,
  lucideImage,
  lucideGripVertical,
  lucideCheck,
  lucidePlus,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { HlmInputImports } from '@spartan/helm/input';

import {
  ApiProductDetail,
  UpdateProductDto,
  ApiProductVariant,
} from '../../../features/products/product.model';
import { ProductService } from '../../../features/products/product.service';
import { AttributeService } from '../../../features/attributes/attribute.service';
import { ProductAttribute } from '../../../features/attributes/attribute.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    FormsModule,
    NgIcon,
    HlmButton,
    HlmCardImports,
    HlmBadgeImports,
    HlmInputImports,
    CdkDropList,
    CdkDrag,
  ],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucidePackage,
      lucideTag,
      lucideLoader2,
      lucideTrash2,
      lucideEdit,
      lucideX,
      lucideUpload,
      lucideImage,
      lucideGripVertical,
      lucideCheck,
      lucidePlus,
    }),
  ],
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly attributeService = inject(AttributeService);

  readonly product = signal<ApiProductDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly isDeleting = signal(false);

  readonly isEditDrawerOpen = signal(false);
  readonly isSaving = signal(false);
  editProductForm = {
    title: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'archived',
  };

  // Image Management
  readonly isUploadingImages = signal(false);
  readonly editingImageAltId = signal<string | null>(null);
  readonly editImageAltText = signal<string>('');

  // Global Attributes
  readonly globalAttributes = signal<ProductAttribute[]>([]);
  readonly variantAxes = computed(() => this.globalAttributes().filter((a) => a.isVariantAxis));

  readonly activeVariantAxes = computed(() => {
    const p = this.product();
    const allAxes = this.variantAxes();

    if (!p || !p.variants || p.variants.length === 0) {
      return allAxes;
    }

    // If the product has only ONE variant and it has NO attribute values (the default variant)
    // then the product is essentially "new" in terms of variant axes, so all axes are allowed.
    if (p.variants.length === 1 && p.variants[0].attributeValues.length === 0) {
      return allAxes;
    }

    const usedAttributeIds = p.variants[0].attributeValues.map((attr) => attr.attributeId);
    return allAxes.filter((axis) => usedAttributeIds.includes(axis.id));
  });

  // Variants Management
  readonly isGenerating = signal(false);
  readonly isGenerateDrawerOpen = signal(false);
  generateVariantsForm = {
    priceAmount: 0,
    stockQuantity: 0,
    axes: [{ attributeId: '', valueIds: [] as string[] }],
  };

  readonly isAddingVariant = signal(false);
  readonly isAddVariantDrawerOpen = signal(false);
  addVariantForm = {
    sku: '',
    priceAmount: 0,
    compareAtAmount: null as number | null,
    stockQuantity: 0,
    lowStockThreshold: 0,
    attributeValueIds: [] as string[],
  };

  readonly isEditVariantDrawerOpen = signal(false);
  readonly editingVariantId = signal<string | null>(null);
  editVariantForm = {
    sku: '',
    priceAmount: 0,
    compareAtAmount: null as number | null,
    stockQuantity: 0,
    lowStockThreshold: 0,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
      this.loadGlobalAttributes();
    } else {
      this.error.set('No product ID provided');
      this.isLoading.set(false);
    }
  }

  loadGlobalAttributes(): void {
    this.attributeService.getAttributes().subscribe({
      next: (attrs) => this.globalAttributes.set(attrs),
      error: (err) => console.error('Failed to load attributes', err),
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product details', err);
        this.error.set('Failed to load product details');
        this.isLoading.set(false);
      },
    });
  }

  deleteProduct(): void {
    const p = this.product();
    if (!p) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.isDeleting.set(true);
      this.productService.deleteProduct(p.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          this.isDeleting.set(false);
        },
      });
    }
  }

  toggleEditDrawer(): void {
    const currentOpen = this.isEditDrawerOpen();
    if (!currentOpen) {
      const p = this.product();
      if (p) {
        this.editProductForm = {
          title: p.title,
          description: p.description || '',
          status: p.status,
        };
      }
    }
    this.isEditDrawerOpen.set(!currentOpen);
  }

  saveProductChanges(): void {
    const p = this.product();
    if (!p) return;

    this.isSaving.set(true);
    const payload: UpdateProductDto = {
      title: this.editProductForm.title,
      description: this.editProductForm.description,
      status: this.editProductForm.status,
    };

    this.productService.updateProduct(p.id, payload).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
        this.isSaving.set(false);
        this.isEditDrawerOpen.set(false);
      },
      error: (err) => {
        console.error('Failed to update product', err);
        this.isSaving.set(false);
      },
    });
  }

  // --- Image Management Methods ---

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const p = this.product();
    if (!p) return;

    const filesArray = Array.from(input.files);
    // Limit to 8
    if (p.images.length + filesArray.length > 8) {
      alert(`You can only have up to 8 images total. You currently have ${p.images.length}.`);
      return;
    }

    this.isUploadingImages.set(true);
    this.productService.uploadProductImages(p.id, filesArray).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
        this.isUploadingImages.set(false);
        input.value = ''; // Reset input
      },
      error: (err) => {
        console.error('Failed to upload images', err);
        this.isUploadingImages.set(false);
        input.value = '';
      },
    });
  }

  dropImage(event: CdkDragDrop<any[]>): void {
    const p = this.product();
    if (!p || !p.images) return;

    const newImages = [...p.images];
    moveItemInArray(newImages, event.previousIndex, event.currentIndex);

    // Optimistic update
    this.product.set({ ...p, images: newImages });

    const payload = newImages.map((img, idx) => ({ id: img.id, position: idx }));
    this.productService.reorderProductImages(p.id, payload).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
      },
      error: (err) => {
        console.error('Failed to reorder images', err);
        this.loadProduct(p.id); // Rollback on error
      },
    });
  }

  startEditingAlt(imageId: string, currentAlt: string | null): void {
    this.editingImageAltId.set(imageId);
    this.editImageAltText.set(currentAlt || '');
  }

  saveImageAlt(imageId: string): void {
    const p = this.product();
    if (!p) return;

    const newAlt = this.editImageAltText().trim() || null;

    // Optimistic update
    const updatedImages = p.images.map((img) =>
      img.id === imageId ? { ...img, altText: newAlt } : img,
    );
    this.product.set({ ...p, images: updatedImages });
    this.editingImageAltId.set(null);

    this.productService.updateProductImage(p.id, imageId, newAlt).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
      },
      error: (err) => {
        console.error('Failed to update image alt text', err);
        this.loadProduct(p.id);
      },
    });
  }

  deleteImage(imageId: string): void {
    const p = this.product();
    if (!p) return;

    if (!confirm('Are you sure you want to delete this image?')) return;

    this.productService.deleteProductImage(p.id, imageId).subscribe({
      next: () => {
        // Optimistic delete, or just reload? The endpoint only returns a message.
        // So let's fetch the product again.
        this.loadProduct(p.id);
      },
      error: (err) => {
        console.error('Failed to delete image', err);
      },
    });
  }

  // --- Variants Management Methods ---

  toggleGenerateDrawer(): void {
    const currentOpen = this.isGenerateDrawerOpen();
    if (!currentOpen) {
      this.generateVariantsForm = {
        priceAmount: 0,
        stockQuantity: 0,
        axes: [{ attributeId: '', valueIds: [] }],
      };
    }
    this.isGenerateDrawerOpen.set(!currentOpen);
  }

  addAxis(): void {
    if (this.generateVariantsForm.axes.length >= 3) return;
    this.generateVariantsForm.axes.push({ attributeId: '', valueIds: [] });
  }

  removeAxis(index: number): void {
    this.generateVariantsForm.axes.splice(index, 1);
  }

  toggleGenerateValue(axisIndex: number, valueId: string): void {
    const axis = this.generateVariantsForm.axes[axisIndex];
    const idx = axis.valueIds.indexOf(valueId);
    if (idx >= 0) {
      axis.valueIds.splice(idx, 1);
    } else {
      axis.valueIds.push(valueId);
    }
  }

  submitGenerateVariants(): void {
    const p = this.product();
    if (!p) return;

    this.isGenerating.set(true);
    // Filter out invalid axes
    const payload = {
      priceAmount: this.generateVariantsForm.priceAmount,
      stockQuantity: this.generateVariantsForm.stockQuantity,
      axes: this.generateVariantsForm.axes.filter((a) => a.attributeId && a.valueIds.length > 0),
    };

    this.productService.generateVariants(p.id, payload).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
        this.isGenerating.set(false);
        this.isGenerateDrawerOpen.set(false);
      },
      error: (err) => {
        console.error('Failed to generate variants', err);
        this.isGenerating.set(false);
      },
    });
  }

  toggleAddVariantDrawer(): void {
    const currentOpen = this.isAddVariantDrawerOpen();
    if (!currentOpen) {
      this.addVariantForm = {
        sku: '',
        priceAmount: 0,
        compareAtAmount: null,
        stockQuantity: 0,
        lowStockThreshold: 0,
        attributeValueIds: [],
      };
    }
    this.isAddVariantDrawerOpen.set(!currentOpen);
  }

  toggleAddVariantValue(valueId: string): void {
    const idx = this.addVariantForm.attributeValueIds.indexOf(valueId);
    if (idx >= 0) {
      this.addVariantForm.attributeValueIds.splice(idx, 1);
    } else {
      // For add variant, typically one value per axis. We don't enforce strictly on UI yet, just toggle it.
      if (this.addVariantForm.attributeValueIds.length >= 3) {
        alert('You can select a maximum of 3 attribute values.');
        return;
      }
      this.addVariantForm.attributeValueIds.push(valueId);
    }
  }

  submitAddVariant(): void {
    const p = this.product();
    if (!p) return;

    this.isAddingVariant.set(true);
    const payload: any = { ...this.addVariantForm };
    if (!payload.sku) {
      payload.sku = null;
    }

    this.productService.addVariant(p.id, payload).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
        this.isAddingVariant.set(false);
        this.isAddVariantDrawerOpen.set(false);
      },
      error: (err) => {
        console.error('Failed to add variant', err);
        this.isAddingVariant.set(false);
      },
    });
  }

  openEditVariantDrawer(variant: ApiProductVariant): void {
    this.editingVariantId.set(variant.id);
    this.editVariantForm = {
      sku: variant.sku || '',
      priceAmount: variant.priceAmount,
      compareAtAmount: variant.compareAtAmount,
      stockQuantity: variant.stockQuantity,
      lowStockThreshold: variant.lowStockThreshold,
    };
    this.isEditVariantDrawerOpen.set(true);
  }

  closeEditVariantDrawer(): void {
    this.isEditVariantDrawerOpen.set(false);
    this.editingVariantId.set(null);
  }

  submitEditVariant(): void {
    const p = this.product();
    const vId = this.editingVariantId();
    if (!p || !vId) return;

    this.isSaving.set(true);
    const payload = { ...this.editVariantForm };
    if (!payload.sku) payload.sku = null as any;

    this.productService.updateVariant(p.id, vId, payload).subscribe({
      next: (updatedProduct) => {
        this.product.set(updatedProduct);
        this.isSaving.set(false);
        this.closeEditVariantDrawer();
      },
      error: (err) => {
        console.error('Failed to update variant', err);
        this.isSaving.set(false);
      },
    });
  }

  deleteVariant(variantId: string): void {
    const p = this.product();
    if (!p) return;

    if (!confirm('Are you sure you want to delete this variant?')) return;

    this.productService.deleteVariant(p.id, variantId).subscribe({
      next: () => {
        this.loadProduct(p.id);
      },
      error: (err) => {
        console.error('Failed to delete variant', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
