import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideZoomIn } from '@ng-icons/lucide';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ lucideZoomIn })],
  host: { class: 'flex flex-col md:flex-row-reverse gap-md' },
})
export class ProductGallery {
  public readonly images = input.required<string[]>();
  public readonly selectedIndex = signal(0);

  protected selectImage(index: number): void {
    this.selectedIndex.set(index);
  }
}
