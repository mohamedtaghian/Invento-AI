import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from './locale-service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly _localeService = inject(LocaleService);

  transform(key: string): string {
    this._localeService.locale();
    return this._localeService.translate(key);
  }
}
