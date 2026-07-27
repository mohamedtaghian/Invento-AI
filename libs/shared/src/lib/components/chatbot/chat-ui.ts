import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend, lucideBot, lucideUser } from '@ng-icons/lucide';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-ui',
  imports: [NgIcon],
  providers: [provideIcons({ lucideSend, lucideBot, lucideUser })],
  templateUrl: './chat-ui.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatUi {
  readonly messages = input<ChatMessage[]>([]);
  readonly placeholder = input('Type a message...');
  readonly sendMessage = output<string>();

  protected send(inputEl: HTMLInputElement): void {
    const text = inputEl.value.trim();
    if (!text) return;
    this.sendMessage.emit(text);
    inputEl.value = '';
  }
}
