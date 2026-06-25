import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from '../../components/home-components/hero/hero';
import { Stats } from '../../components/home-components/stats/stats';
import { Pipeline } from '../../components/home-components/pipeline/pipeline';
import { Capabilities } from '../../components/home-components/capabilities/capabilities';
import { Cta } from '../../components/home-components/cta/cta';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Stats, Pipeline, Capabilities, Cta],
})
export class Home {}
