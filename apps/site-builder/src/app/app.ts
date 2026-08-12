import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@/app/components/loader.component/loader';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, NgxSonnerToaster],
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
