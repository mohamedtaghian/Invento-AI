import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmSidebarImports } from '@spartan/helm/sidebar';
import { Sidebar } from '@invento/invento/shared/ui/sidebar/sidebar';
import { Header } from '@invento/invento/shared/ui/header/header';
import { ChatPanel } from '@invento/shared';
import { TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NgIcon,
    HlmButton,
    HlmSidebarImports,
    Sidebar,
    Header,
    ChatPanel,
    TranslatePipe,
  ],
  providers: [provideIcons({ lucideBot })],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly isChatOpen = signal(false);

  protected toggleChat(): void {
    this.isChatOpen.update((open) => !open);
  }
}
