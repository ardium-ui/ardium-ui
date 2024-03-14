import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { ArdSnackbarData, ArdSnackbarOptions } from './snackbar.types';
import { OverlayRef } from '@angular/cdk/overlay';

export const ARD_SNACKBAR_DATA = new InjectionToken<ArdSnackbarData>('ArdSnackbarData');

export class _ArdSnackbarRefInternal<T> {
    constructor(
        public component: ComponentType<T>,
        public options: Required<ArdSnackbarOptions>,
        dismiss: (withAction?: boolean) => void
    ) {
        this.publicRef = new ArdSnackbarRef(dismiss, this._onOpen);
    }

    readonly publicRef!: ArdSnackbarRef<T>;

    timeout!: NodeJS.Timeout;
    overlay!: OverlayRef;

    private readonly _onOpen = new Subject<void>();

    markAsOpened() {
        this._onOpen.next();
        this._onOpen.complete();
    }
}
export class ArdSnackbarRef<T> {
    constructor(
        private dismiss: (withAction?: boolean) => void,
        private _onOpen: Subject<void>
    ) {}

    private readonly _onClose = new Subject<boolean>();
    public readonly onOpen = this._onOpen.asObservable();
    public readonly onClose = this._onClose.asObservable();

    public instance!: T;

    close(withAction: boolean = false): void {
        if (this.isClosed) return;
        this.dismiss(withAction);
        this.markAsClosed();
    }

    markAsClosed(withAction: boolean = false): void {
        if (this.isClosed) return;
        this._onClose.next(withAction);
        this._onClose.complete();
        this._isClosed = true;
    }

    private _isClosed = false;
    public get isClosed(): boolean {
        return this._isClosed;
    }
}
