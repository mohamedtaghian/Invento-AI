import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chatbot } from './components/chatbot/chatbot';

@Component({
  imports: [RouterModule, Chatbot],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'userSite';
}
