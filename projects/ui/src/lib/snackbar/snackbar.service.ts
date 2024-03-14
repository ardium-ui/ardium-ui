import {
    ComponentType,
    Overlay,
    OverlayConfig,
    OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy, inject } from '@angular/core';
import { isArray } from 'simple-bool';
import { Queue } from '../_internal/queue';
import {
    ARD_SNACKBAR_DATA,
    ArdSnackbarRef,
    _ArdSnackbarRefInternal,
} from './snackbar-ref';
import { _ArdSimpleSnackbar } from './snackbar.component';
import {
    ARD_SNACKBAR_ANIMATION_LENGTH,
    ARD_SNACKBAR_DEFAULT_OPTIONS,
} from './snackbar.token';
import { ArdSnackbarOptions, ArdSnackbarQueueHandling } from './snackbar.types';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService implements OnDestroy {
    private readonly _snackbarQueue = new Queue<
        _ArdSnackbarRefInternal<unknown>
    >();
    private _openedSnackbar?: _ArdSnackbarRefInternal<unknown>;

    private readonly _defaultOptions = inject(ARD_SNACKBAR_DEFAULT_OPTIONS);
    private readonly _animationLength = inject(ARD_SNACKBAR_ANIMATION_LENGTH);
    private readonly _overlay = inject(Overlay);
    private readonly _injector = inject(Injector);

    open(
        message: string,
        action: string = '',
        options: ArdSnackbarOptions = { data: { message, action } }
    ): ArdSnackbarRef<_ArdSimpleSnackbar> {
        const mergedOptions = this._mergeOptions(options);

        if (
            typeof mergedOptions.data === 'object' &&
            !isArray(mergedOptions.data)
        ) {
            mergedOptions.data.message = message;
            mergedOptions.data.action = action;
        }

        const internalRef = new _ArdSnackbarRefInternal(
            _ArdSimpleSnackbar,
            mergedOptions,
            (withAction?: boolean) => this.dismissCurrent(withAction)
        );

        this._handleQueue(options.queueHandling!, internalRef);
        return internalRef.publicRef;
    }
    openFromComponent<T>(
        component: ComponentType<T>,
        options: ArdSnackbarOptions
    ): ArdSnackbarRef<T> {
        const mergedOptions = this._mergeOptions(options);

        const internalRef = new _ArdSnackbarRefInternal(
            component,
            mergedOptions,
            (withAction?: boolean) => this.dismissCurrent(withAction)
        );

        this._handleQueue(options.queueHandling!, internalRef);
        return internalRef.publicRef;
    }
    private _handleQueue<T>(
        handling: ArdSnackbarQueueHandling,
        ref: _ArdSnackbarRefInternal<T>
    ) {
        if (handling === ArdSnackbarQueueHandling.Default) {
            const wasEmpty = this._snackbarQueue.isEmpty();
            this._snackbarQueue.push(ref);
            if (wasEmpty) {
                this._openNext();
            }
        } else if (handling === ArdSnackbarQueueHandling.Skip) {
            this._snackbarQueue.pushFront(ref);
            this.dismissCurrent(false);
            //it is opened automatically within the dismiss method
        } else if (handling === ArdSnackbarQueueHandling.Overwrite) {
            this._snackbarQueue.clear();
            this._snackbarQueue.push(ref);
            this.dismissCurrent(false);
            //it is opened automatically within the dismiss method
        }
    }
    private _mergeOptions(
        options: ArdSnackbarOptions
    ): Required<ArdSnackbarOptions> {
        if (options.placement) {
            options.placement = {
                ...this._defaultOptions.placement,
                ...options.placement,
            };
        } else {
            options.placement = this._defaultOptions.placement;
        }
        return {
            ...this._defaultOptions,
            ...options,
        } as Required<ArdSnackbarOptions>;
    }
    private _openNext() {
        const sb = this._snackbarQueue.pop();
        if (!sb) return;
        this._openedSnackbar = sb;
        const overlay = this._createOverlay(sb.options);

        const injector = this._createInjector(sb.options, sb.publicRef);
        const portal = new ComponentPortal(sb.component, undefined, injector);
        const componentRef = overlay.attach(portal);
        sb.publicRef.instance = componentRef.instance;
        sb.markAsOpened();

        this._openedSnackbar = sb;

        sb.timeout = setTimeout(() => {
            this.dismissCurrent(false);
        }, sb.options.duration);
    }
    private _createOverlay(options: ArdSnackbarOptions): OverlayRef {
        const strategy = this._overlay.position().global();

        // horizontal align
        if (options.placement?.align?.match('left')) {
            strategy.left('0');
        } else if (options.placement?.align?.match('right')) {
            strategy.right('0');
        } else {
            strategy.centerHorizontally();
        }
        //vertical align
        if (options.placement?.align?.match('bottom')) {
            strategy.bottom('0');
        } else {
            strategy.top('0');
        }

        const config = new OverlayConfig({
            positionStrategy: strategy,
            hasBackdrop: false,
        });

        return this._overlay.create(config);
    }
    dismissCurrent(withAction?: boolean) {
        const sb = this._openedSnackbar;
        if (!sb) {
            console.warn(
                new Error(
                    `ARD-WA8010: trying to dismiss the current snackbar, but no snackbar is currently opened.`
                )
            );
            return;
        }

        setTimeout(() => {
            sb.overlay.dispose();
            this._openedSnackbar = undefined;
            sb.publicRef.markAsClosed(withAction);

            this._openNext();
        }, this._animationLength);
    }

    ngOnDestroy(): void {
        this._snackbarQueue.clear();
        this.dismissCurrent(false);
    }

    private _createInjector<T>(
        options: ArdSnackbarOptions,
        snackbarRef: ArdSnackbarRef<T>
    ): Injector {
        return Injector.create({
            parent: this._injector,
            providers: [
                { provide: ArdSnackbarRef, useValue: snackbarRef },
                { provide: ARD_SNACKBAR_DATA, useValue: options.data },
            ],
        });
    }
}
