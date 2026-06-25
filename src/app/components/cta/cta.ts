import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cta {}
