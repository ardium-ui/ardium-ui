import { Observable, Subject } from 'rxjs';
import { ArdSnackbarOptions } from './snackbar.types';

export type ArdSnackbarRef = {
    close(withAction?: boolean): void;
    onOpen: Observable<void>;
    onClose: Observable<boolean>;
    isClosed: boolean;
};

export class _ArdSnackbarRefInternal {
    constructor(
        private message: string,
        private action: string,
        private options: ArdSnackbarOptions,
        dismiss: (withAction?: boolean) => void
    ) {
        this.publicRef = new _ArdSnackbarRef(dismiss, this._onOpen);
    }

    readonly publicRef!: ArdSnackbarRef;

    private readonly _onOpen = new Subject<void>();

    open() {
        this._onOpen.next();
        this._onOpen.complete();
        return {
            message: this.message,
            action: this.action,
            options: this.options,
        };
    }
}
export class _ArdSnackbarRef implements ArdSnackbarRef {
    constructor(
        private dismiss: (withAction?: boolean) => void,
        private _onOpen: Subject<void>
    ) {}

    private readonly _onClose = new Subject<boolean>();
    public readonly onOpen = this._onOpen.asObservable();
    public readonly onClose = this._onClose.asObservable();

    close(withAction: boolean = false): void {
        if (this._isClosed) return;
        this.dismiss(withAction);
        this._onClose.next(withAction);
        this._onClose.complete();
        this._isClosed = true;
    }

    private _isClosed = false;
    public get isClosed(): boolean {
        return this._isClosed;
    }
}
