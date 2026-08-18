import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '@invento/user-site/app/shared/components/footer/footer';
import { Navbar } from '@invento/user-site/app/shared/components/navbar/navbar';
import { Chatbot } from '@invento/user-site/app/features/chatbot/chatbot';
import { HlmToasterImports } from '@spartan/helm/sonner';
import { StoreSeoService } from '@invento/user-site/app/core/service/store-seo.service';
import { StoreThemeService } from '@invento/user-site/app/core/service/store-theme.service';

@Component({
  imports: [RouterModule, Chatbot, Navbar, Footer, HlmToasterImports],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'userSite';

  /**
   * Both are root-provided and purely reactive, so nothing injects them otherwise and they
   * would never be constructed. Injecting here starts them once, for every route — the
   * store's palette and metadata belong to the whole storefront, not just the landing page.
   */
  private readonly storeTheme = inject(StoreThemeService);
  private readonly storeSeo = inject(StoreSeoService);
}
