import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram, lucideTwitter, lucideMail } from '@ng-icons/lucide';
import { HlmTypographyImports } from '@spartan/helm/typography';
import { TranslatePipe } from '@invento/core';
import { StoreService } from '../../../core/service/store.service';
import { StoreSlugService } from '../../../core/service/store-slug.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, HlmTypographyImports, TranslatePipe],
  providers: [provideIcons({ lucideFacebook, lucideInstagram, lucideTwitter, lucideMail })],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly storeService = inject(StoreService);

  /** Shared with the navbar, home and every product card, so they cannot drift apart. */
  protected readonly activeStoreSlug = inject(StoreSlugService).slug;

  protected readonly year = new Date().getFullYear();
}
