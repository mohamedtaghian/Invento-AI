import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageSquare, lucideX } from '@ng-icons/lucide';
import { TranslatePipe } from '@invento/core';
import { ChatUi, type ChatMessage } from './chat-ui';

@Component({
  selector: 'app-chat-popup',
  imports: [NgIcon, ChatUi, TranslatePipe],
  providers: [provideIcons({ lucideMessageSquare, lucideX })],
  templateUrl: './chat-popup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPopup {
  protected readonly isOpen = signal(false);
  protected readonly messages = signal<ChatMessage[]>([]);

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  protected onSend(text: string): void {
    this.messages.update((msgs) => [
      ...msgs,
      { role: 'user', content: text },
      { role: 'assistant', content: 'Thanks for your message! Our team will get back to you shortly.' },
    ]);
  }
}
