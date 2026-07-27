import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chatbot } from './components/chatbot/chatbot';
import { Footer } from './components/footer/footer';

@Component({
  imports: [RouterModule, Chatbot, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'userSite';
}
