import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBotMessageSquare, lucideX, lucideSendHorizonal } from '@ng-icons/lucide';
import { HlmPopoverImports } from '@spartan/helm/popover';
import { HlmButtonImports } from '@spartan/helm/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  imports: [NgIcon, HlmPopoverImports, HlmButtonImports, FormsModule],
  templateUrl: './chatbot.html',
  viewProviders: [provideIcons({ lucideBotMessageSquare, lucideX, lucideSendHorizonal })],
})
export class Chatbot {
  inputMessage = '';
}
