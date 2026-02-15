import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ARD_BREAKPOINTS } from './breakpoints';

@Injectable()
export class ArdiumBreakpointService implements OnDestroy {
  private readonly _destroyed = new Subject<void>();

  public readonly breakpointMap = inject(ARD_BREAKPOINTS);
  public readonly breakpoints = Array.from(this.breakpointMap.values());

  public readonly currentBreakpoint = signal<string | null>(null);

  constructor() {
    inject(BreakpointObserver)
      .observe(Array.from(this.breakpointMap.keys()))
      .pipe(takeUntil(this._destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentBreakpoint.set(this.breakpointMap.get(query)!);
          }
        }
      });
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
