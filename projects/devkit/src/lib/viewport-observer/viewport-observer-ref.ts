import { computed, signal } from '@angular/core';
import { Observable, Subject, throttle, interval, Subscription } from 'rxjs';
import { throttleSaveLast } from './throttleSaveLast';

export const ViewportRelation = {
    Above: 'above',
    Inside: 'inside',
    Below: 'below',
    Undefined: 'undefined',
} as const;
export type ViewportRelation =
    (typeof ViewportRelation)[keyof typeof ViewportRelation];

/**
 * Copied from [Microsoft Learn](https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone).
 */
type RequireAtLeastOne<T> = {
    [K in keyof T]-?: Required<Pick<T, K>> &
        Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type ArdViewportObserverConfig = {
    margin?: number | RequireAtLeastOne<{ top: number; bottom: number }>;
    throttleTime?: number;
};

export class ArdViewportObserverRef {
    constructor(
        private readonly element: HTMLElement,
        private readonly scroll$: Observable<void>,
        config?: ArdViewportObserverConfig
    ) {
        setTimeout(() => {
            this._checkViewportRelation();
        }, 0);

        this._throttleTime = config?.throttleTime ?? 100;
        this._margins = {
            top:
                (typeof config?.margin === 'number'
                    ? config?.margin
                    : config?.margin?.top) ?? 0,
            bottom:
                (typeof config?.margin === 'number'
                    ? config?.margin
                    : config?.margin?.bottom) ?? 0,
        };

        this.subscription = this.scroll$
            .pipe(throttleSaveLast(this._throttleTime))
            .subscribe(() => this._checkViewportRelation());
    }

    private readonly _throttleTime!: number;
    private readonly _margins!: { top: number; bottom: number };

    private readonly _leaveVieportSubject = new Subject<void>();
    public readonly leaveViewport = this._leaveVieportSubject.asObservable();

    private readonly _enterVieportSubject = new Subject<void>();
    public readonly enterViewport = this._enterVieportSubject.asObservable();

    private readonly _viewportRelation = signal<ViewportRelation>(
        ViewportRelation.Undefined
    );
    public readonly viewportRelation = computed(() => this._viewportRelation());
    public readonly isInViewport = computed(
        () => this._viewportRelation() === ViewportRelation.Undefined
    );

    private readonly subscription!: Subscription;

    private _checkViewportRelation() {
        const domRect = this.element.getBoundingClientRect();
        console.log('_checkViewportRelation');

        const oldRelation = this._viewportRelation();
        let newRelation!: ViewportRelation;

        if (domRect.bottom < this._margins.top)
            newRelation = ViewportRelation.Above;
        else if (domRect.top > window.innerHeight - this._margins.bottom)
            newRelation = ViewportRelation.Below;
        else newRelation = ViewportRelation.Inside;

        this._viewportRelation.set(newRelation);

        if (
            newRelation !== ViewportRelation.Inside &&
            (oldRelation === ViewportRelation.Inside ||
                oldRelation === ViewportRelation.Undefined)
        ) {
            this._leaveVieportSubject.next();
        }

        if (
            newRelation === ViewportRelation.Inside &&
            oldRelation !== ViewportRelation.Inside
        ) {
            this._enterVieportSubject.next();
        }
    }

    private readonly _isDestroyed = signal(false);
    public readonly isDestroyed = computed(() => this._isDestroyed());

    public destroy(): void {
        if (this.isDestroyed()) return;
        this._isDestroyed.set(true);
        this.subscription.unsubscribe();
        this._leaveVieportSubject.complete();
    }

    public setMargin(topAndBottom: number): ArdViewportObserverRef;
    public setMargin(top: number, bottom: number): ArdViewportObserverRef;
    public setMargin(
        top: number,
        bottom: number = top
    ): ArdViewportObserverRef {
        this._margins.top = top;
        this._margins.bottom = bottom;
        this._checkViewportRelation();
        return this;
    }
}
