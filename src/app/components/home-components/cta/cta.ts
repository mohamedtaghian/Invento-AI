import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBolt } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan/helm/button';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideBolt })],
})
export class Cta {}
