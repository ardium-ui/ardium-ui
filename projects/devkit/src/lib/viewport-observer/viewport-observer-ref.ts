import { computed, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const ViewportRelation = {
    Above: 'above',
    Inside: 'inside',
    Below: 'below',
    Undefined: 'undefined',
} as const;
export type ViewportRelation = (typeof ViewportRelation)[keyof typeof ViewportRelation];

export class ArdViewportObserverRef {
    constructor(private readonly element: HTMLElement, private readonly scroll$: Observable<void>, private readonly hostEl: HTMLElement) {}

    private readonly _margins = {
        top: 0,
        bottom: 0,
    }

    private readonly _leaveVieportSubject = new Subject<void>();
    public readonly leaveViewport = this._leaveVieportSubject.asObservable();

    private readonly _enterVieportSubject = new Subject<void>();
    public readonly enterViewport = this._enterVieportSubject.asObservable();

    private readonly _viewportRelation = signal<ViewportRelation>(ViewportRelation.Undefined);
    public readonly viewportRelation = computed(() => this._viewportRelation());
    public readonly isInViewport = computed(() => this._viewportRelation() === ViewportRelation.Undefined);

    private readonly subscription = this.scroll$.subscribe(() => {
        const domRect = this.element.getBoundingClientRect();

        const oldRelation = this._viewportRelation();
        let newRelation!: ViewportRelation;

        if (domRect.bottom < this._margins.top) newRelation = ViewportRelation.Above;
        else if (domRect.top > window.innerHeight - this._margins.bottom) newRelation = ViewportRelation.Below;
        else newRelation = ViewportRelation.Inside;

        this._viewportRelation.set(newRelation);

        if (
            newRelation !== ViewportRelation.Inside &&
            (oldRelation === ViewportRelation.Inside || oldRelation === ViewportRelation.Undefined)
        ) {
            this._leaveVieportSubject.next();
        }

        if (newRelation === ViewportRelation.Inside && oldRelation !== ViewportRelation.Inside) {
            this._enterVieportSubject.next();
        }
    });

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
    public setMargin(top: number, bottom: number = top): ArdViewportObserverRef {
        this._margins.top = top;
        this._margins.bottom = bottom;
        return this;
    }
}
