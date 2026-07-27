import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideX } from '@ng-icons/lucide';
import { TranslatePipe } from '@invento/core';
import { ChatUi, type ChatMessage } from './chat-ui';

@Component({
  selector: 'app-chat-panel',
  imports: [NgIcon, ChatUi, TranslatePipe],
  providers: [provideIcons({ lucideBot, lucideX })],
  templateUrl: './chat-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPanel {
  readonly title = input('chat_title');
  readonly showHeader = input(true);
  readonly closePanel = output<void>();

  protected readonly messages = signal<ChatMessage[]>([]);

  protected onSend(text: string): void {
    this.messages.update((msgs) => [
      ...msgs,
      { role: 'user', content: text },
      { role: 'assistant', content: 'I\'ll look into that for you. Let me check the system data.' },
    ]);
  }
}
