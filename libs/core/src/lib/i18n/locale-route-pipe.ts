import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from './locale-service';

@Pipe({
  name: 'localeRoute',
  pure: false,
})
export class LocaleRoutePipe implements PipeTransform {
  private readonly _localeService = inject(LocaleService);

  transform(segments: string[]): string[] {
    return ['/', this._localeService.locale(), ...segments];
  }
}
