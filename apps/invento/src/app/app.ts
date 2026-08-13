import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HlmToasterImports } from '@spartan/helm/sonner';

@Component({
  imports: [RouterModule, HlmToasterImports, NgxSonnerToaster],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'invento';
}
