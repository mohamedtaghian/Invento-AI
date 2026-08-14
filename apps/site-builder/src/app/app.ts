import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './features/builder/components/loader.component/loader';
import { HlmToasterImports } from '@spartan/helm/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, HlmToasterImports],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('invento-AI');

  protected readonly isLoading = signal<boolean>(true);

  constructor() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);
  }
}
