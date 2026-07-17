import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocaleService } from './locale-service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly _localeService = inject(LocaleService);

  transform(key: string, params?: Record<string, string | number>): string {
    this._localeService.locale();
    return this._localeService.translate(key, params);
  }
}

// Mo'men Comment: 
// TranslatePipe -> used as -> {{ 'home.title' | translate }} or {{ 'greeting' | translate: { name: user.name } }}.
//    -> translate()'s output depends on the reactive _translations signal inside LocaleService, which is not a declared pipe input, so a pure pipe wouldn't pick up changes when the locale switches.
// 
// Because pipes are impure here, Angular will call transform() every change-detection cycle regardless 
//  -> but this line adds an explicit read of the locale signal purely to make the reactive dependency obvious/intentional 
//  -> in the code, reinforcing that this pipe's output is tied to locale changes. 