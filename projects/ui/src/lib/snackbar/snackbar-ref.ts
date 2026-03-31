import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComponentColor } from '../types/colors.types';
import { ArdSnackbarData, ArdSnackbarOptions, ArdSnackbarType } from './snackbar.types';

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

  timeout!: any;
  overlay!: OverlayRef;

  private readonly _onOpen = new Subject<void>();
  private readonly _onCloseStart = new BehaviorSubject<boolean>(false);

  markAsOpened() {
    this._onOpen.next();
    this._onOpen.complete();
  }
  markAsStartingToClose(withAction = false) {
    this._onCloseStart.next(withAction);
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
  private readonly _onAction = new Subject<void>();
  public readonly onOpen = this._onOpen.asObservable();
  public readonly onClose = this._onClose.asObservable();
  public readonly onAction = this._onAction.asObservable();
  public readonly onCloseStart = this._onCloseStart.asObservable();

  public instance!: T;

  close(withAction = false): void {
    if (this.isClosed) return;
    this.dismiss(withAction);
    if (withAction) {
      this._onAction.next();
    }
    this._onAction.complete();
  }

  markAsClosed(withAction = false): void {
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
