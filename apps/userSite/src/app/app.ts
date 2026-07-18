import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chatbot } from './components/chatbot/chatbot';
import { Navbar } from './components/navbar/navbar';

@Component({
  imports: [RouterModule, Chatbot, Navbar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'userSite';
}
