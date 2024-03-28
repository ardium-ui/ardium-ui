import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArdSnackbarData, ArdSnackbarOptions, ArdSnackbarType } from './snackbar.types';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentColor } from '../types/colors.types';

export const ARD_SNACKBAR_DATA = new InjectionToken<ArdSnackbarData>('ArdSnackbarData');
export const ARD_SNACKBAR_COLOR = new InjectionToken<ComponentColor>('ArdSnackbarColor');
export const ARD_SNACKBAR_TYPE = new InjectionToken<ArdSnackbarType>('ArdSnackbarType');

export class _ArdSnackbarRefInternal<T> {
  constructor(
    public component: ComponentType<T>,
    public options: Required<ArdSnackbarOptions>,
    dismiss: (withAction?: boolean) => void
  ) {
    this.publicRef = new ArdSnackbarRef(dismiss, this._onOpen, this._onCloseStart);
  }

  readonly publicRef!: ArdSnackbarRef<T>;

  timeout!: NodeJS.Timeout;
  overlay!: OverlayRef;

  private readonly _onOpen = new Subject<void>();
  private readonly _onCloseStart = new BehaviorSubject<boolean>(false);

  markAsOpened() {
    this._onOpen.next();
    this._onOpen.complete();
  }
  markAsStartingToClose() {
    this._onCloseStart.next(true);
    this._onCloseStart.complete();
  }
}
export class ArdSnackbarRef<T = unknown> {
  constructor(
    private readonly dismiss: (withAction?: boolean) => void,
    private readonly _onOpen: Subject<void>,
    private readonly _onCloseStart: BehaviorSubject<boolean>
  ) {}

  private readonly _onClose = new Subject<boolean>();
  public readonly onOpen = this._onOpen.asObservable();
  public readonly onClose = this._onClose.asObservable();
  public readonly onCloseStart = this._onCloseStart.asObservable();

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
