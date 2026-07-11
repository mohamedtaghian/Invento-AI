import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

interface Stat {
  readonly raw: string;
  readonly label: string;
  readonly numericValue: number | null;
  readonly prefix: string;
  readonly suffix: string;
}

interface DisplayStat {
  readonly label: string;
  display: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollAnimateDirective],
})
export class Stats implements OnInit, OnDestroy {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _el = inject(ElementRef);
  private _observer: IntersectionObserver | null = null;
  private _animationStarted = false;

  protected readonly displayStats = signal<DisplayStat[]>([
    { label: 'Build Stages', display: '0' },
    { label: 'Schema Types', display: '∞' },
    { label: 'AI-Generated', display: '0%' },
    { label: 'Time to Deploy', display: '<0min' },
  ]);

  private readonly _stats: Stat[] = [
    { raw: '6', label: 'Build Stages', numericValue: 6, prefix: '', suffix: '' },
    { raw: '∞', label: 'Schema Types', numericValue: null, prefix: '', suffix: '' },
    { raw: '100%', label: 'AI-Generated', numericValue: 100, prefix: '', suffix: '%' },
    { raw: '<2min', label: 'Time to Deploy', numericValue: 2, prefix: '<', suffix: 'min' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      this.displayStats.set(this._stats.map((s) => ({ label: s.label, display: s.raw })));
      return;
    }

    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._animationStarted) {
          this._animationStarted = true;
          this._runCounters();
          this._observer?.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    this._observer.observe(this._el.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
  }

  private _runCounters(): void {
    this._stats.forEach((stat, index) => {
      if (stat.numericValue === null) return;

      const duration = 1800;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stat.numericValue! / steps;
        if (current >= stat.numericValue!) {
          current = stat.numericValue!;
          clearInterval(timer);
        }

        this.displayStats.update((stats) =>
          stats.map((s, i) =>
            i === index
              ? { ...s, display: `${stat.prefix}${Math.round(current)}${stat.suffix}` }
              : s,
          ),
        );
      }, stepTime);
    });
  }
}
