import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '@invento/user-site/app/shared/components/footer/footer';
import { Navbar } from '@invento/user-site/app/shared/components/navbar/navbar';
import { Chatbot } from '@invento/user-site/app/features/chatbot/chatbot';

@Component({
  imports: [RouterModule, Chatbot, Navbar, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'userSite';
}
