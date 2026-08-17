import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideSearch,
  lucideChevronRight,
  lucidePlus,
  lucideX,
  lucideAlertCircle,
  lucideLoader2,
  lucideTags,
  lucideTrash2,
  lucideEdit,
  lucideSettings2,
  lucideGripVertical,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';

import { ProductAttribute, ProductAttributeValue } from '../../features/attributes/attribute.model';
import { AttributeService } from '../../features/attributes/attribute.service';
import { AttributeDisplayStyle } from '../../features/attributes/attribute.model';
import { AttributeSearchPipe } from '../../features/attributes/attribute-search.pipe';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [
    FormsModule,
    NgIcon,
    HlmButton,
    HlmCardImports,
    HlmInputImports,
    DragDropModule,
    AttributeSearchPipe,
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
      lucideTags,
      lucideTrash2,
      lucideEdit,
      lucideSettings2,
      lucideGripVertical,
    }),
  ],
  templateUrl: './attributes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesComponent implements OnInit {
  private readonly attributeService = inject(AttributeService);

  readonly attributes = signal<ProductAttribute[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchQuery = signal('');

  // Attribute Drawer State
  readonly isAttributeDrawerOpen = signal(false);
  readonly editingAttribute = signal<ProductAttribute | null>(null);

  // Attribute Form Models
  attrName = signal('');
  attrKey = signal('');
  attrStyle = signal<AttributeDisplayStyle>(AttributeDisplayStyle.List);
  attrIsFilterable = signal(true);
  attrShowOnProductPage = signal(true);

  // Values Drawer State
  readonly isValuesDrawerOpen = signal(false);
  readonly activeAttributeForValues = signal<ProductAttribute | null>(null);

  // Value Form Models
  newValueName = signal('');
  newValueSlug = signal('');

  ngOnInit(): void {
    this.fetchAttributes();
  }

  fetchAttributes(): void {
    this.isLoading.set(true);

    this.attributeService.getAttributes().subscribe({
      next: (data: ProductAttribute[]) => {
        this.attributes.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load attributes', err);
        this.isLoading.set(false);
      },
    });
  }

  // --- Attribute CRUD ---

  openAddAttributeDrawer(): void {
    this.editingAttribute.set(null);
    this.attrName.set('');
    this.attrKey.set('');
    this.attrStyle.set(AttributeDisplayStyle.List);
    this.attrIsFilterable.set(true);
    this.attrShowOnProductPage.set(true);
    this.isAttributeDrawerOpen.set(true);
  }

  openEditAttributeDrawer(attr: ProductAttribute): void {
    this.editingAttribute.set(attr);
    this.attrName.set(attr.name);
    this.attrKey.set(attr.key);
    this.attrStyle.set(attr.displayStyle as AttributeDisplayStyle);
    this.attrIsFilterable.set(attr.isFilterable);
    this.attrShowOnProductPage.set(attr.showOnProductPage);
    this.isAttributeDrawerOpen.set(true);
  }

  closeAttributeDrawer(): void {
    this.isAttributeDrawerOpen.set(false);
  }

  saveAttribute(): void {
    const isEdit = this.editingAttribute();

    if (isEdit) {
      this.attributeService
        .updateAttribute(isEdit.id, {
          name: this.attrName(),
          key: this.attrKey(),
          displayStyle: this.attrStyle(),
          isFilterable: this.attrIsFilterable(),
          showOnProductPage: this.attrShowOnProductPage(),
        })
        .subscribe({
          next: () => {
            this.fetchAttributes();
            this.closeAttributeDrawer();
          },
          error: (err) => console.error('Failed to update attribute', err),
        });
    } else {
      this.attributeService
        .createAttribute({
          name: this.attrName(),
          key: this.attrKey() || undefined,
          displayStyle: this.attrStyle(),
          isFilterable: this.attrIsFilterable(),
          showOnProductPage: this.attrShowOnProductPage(),
          isVariantAxis: false,
        })
        .subscribe({
          next: () => {
            this.fetchAttributes();
            this.closeAttributeDrawer();
          },
          error: (err) => console.error('Failed to create attribute', err),
        });
    }
  }

  deleteAttribute(id: string): void {
    if (confirm('Are you sure you want to delete this attribute?')) {
      this.attributeService.deleteAttribute(id).subscribe({
        next: () => this.fetchAttributes(),
        error: (err) => console.error('Failed to delete attribute', err),
      });
    }
  }

  // --- Value CRUD ---

  openValuesDrawer(attr: ProductAttribute): void {
    this.activeAttributeForValues.set(attr);
    this.newValueName.set('');
    this.newValueSlug.set('');
    this.isValuesDrawerOpen.set(true);
  }

  closeValuesDrawer(): void {
    this.isValuesDrawerOpen.set(false);
    this.activeAttributeForValues.set(null);
  }

  addValue(): void {
    const attr = this.activeAttributeForValues();
    if (!attr) return;

    this.attributeService
      .addAttributeValue(attr.id, {
        value: this.newValueName(),
        slug: this.newValueSlug() || undefined,
      })
      .subscribe({
        next: (updatedAttr) => {
          this.activeAttributeForValues.set(updatedAttr);
          this.newValueName.set('');
          this.newValueSlug.set('');
          this.fetchAttributes();
        },
        error: (err) => console.error('Failed to add value', err),
      });
  }

  deleteValue(valueId: string): void {
    const attr = this.activeAttributeForValues();
    if (!attr) return;

    this.attributeService.deleteAttributeValue(attr.id, valueId).subscribe({
      next: () => {
        this.attributeService.getAttributes().subscribe((attrs) => {
          this.attributes.set(attrs);
          const updatedAttr = attrs.find((a) => a.id === attr.id) || null;
          this.activeAttributeForValues.set(updatedAttr);
        });
      },
      error: (err) => console.error('Failed to delete value', err),
    });
  }

  dropAttribute(event: CdkDragDrop<ProductAttribute[]>): void {
    const currentList = [...this.attributes()];
    moveItemInArray(currentList, event.previousIndex, event.currentIndex);
    this.attributes.set(currentList);

    const reorderItems = currentList.map((attr, index) => ({ id: attr.id, position: index }));
    this.attributeService.reorderAttributes({ items: reorderItems }).subscribe({
      next: (updatedAttrs) => this.attributes.set(updatedAttrs),
      error: (err) => console.error('Failed to reorder attributes', err),
    });
  }

  dropValue(event: CdkDragDrop<ProductAttributeValue[]>): void {
    const attr = this.activeAttributeForValues();
    if (!attr) return;

    const currentValues = [...attr.values];
    moveItemInArray(currentValues, event.previousIndex, event.currentIndex);
    attr.values = currentValues;
    this.activeAttributeForValues.set(attr);

    const reorderItems = currentValues.map((val, index) => ({ id: val.id, position: index }));
    this.attributeService.reorderAttributeValues(attr.id, { items: reorderItems }).subscribe({
      next: (updatedAttr) => {
        this.activeAttributeForValues.set(updatedAttr);
        this.fetchAttributes();
      },
      error: (err) => console.error('Failed to reorder values', err),
    });
  }
}
