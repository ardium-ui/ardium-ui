import { Injectable, OnDestroy, Renderer2, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { ArdViewportObserverRef } from './viewport-observer-ref';

@Injectable({ providedIn: 'root' })
export class ArdiumViewportObserverService implements OnDestroy {

    private readonly renderer = inject(Renderer2);
    private readonly document = inject(DOCUMENT);

    private readonly _scrollSubject = new Subject<void>();
    private readonly scroll$ = this._scrollSubject.asObservable();

    private readonly _registeredObservers: ArdViewportObserverRef[] = [];

    private readonly _scrollHost = signal<HTMLElement | Document>(this.document.body);
    private _scrollCleanupFn = computed<() => void>(() => {
        return this.renderer.listen(this._scrollHost(), 'scroll', () => {
            this._scrollSubject.next();
        });
    });

    // maybe will implement later
    // for now it will remain private
    private setScrollHost(element: HTMLElement | Document): void {
        this.ngOnDestroy();
        this._scrollHost.set(element);
    }

    public observeElement(element: HTMLElement): ArdViewportObserverRef {
        const host = this._scrollHost();
        const vo = new ArdViewportObserverRef(
            element,
            this.scroll$,
            host instanceof Document ? host.body : host
        );
        this._registeredObservers.push(vo);
        return vo;
    }

    public observeById(id: string): ArdViewportObserverRef {
        const element = this.document.getElementById(id);

        if (!element) {
            throw new Error(`DKT-NF0001: Trying to observe an element by id, but the element does not exist.`);
        }
        return this.observeElement(element);
    }

    public triggerRecheck(): void {
        this._scrollSubject.next();
    }

    ngOnDestroy(): void {
        this._scrollCleanupFn?.();
        this._registeredObservers.forEach(obs => obs.destroy());
    }
}
