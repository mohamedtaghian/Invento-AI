import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocaleService } from '@invento/core';

@Component({
  selector: 'app-lang-selector',
  imports: [],
  templateUrl: './lang-selector.html',
  styleUrl: './lang-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSelector {
  protected readonly localeService = inject(LocaleService);

  protected toggle(): void {
    const next = this.localeService.locale() === 'en' ? 'ar' : 'en';
    this.localeService.switchLocale(next);
  }
}
