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

/**
 * Reference to an opened snackbar.
 * Provides methods for closing the snackbar programmatically, and observables for subscribing to open, close, and action events.
 */
export class ArdSnackbarRef<T = unknown> {
  constructor(
    private readonly dismiss: (withAction?: boolean) => void,
    private readonly _onOpen: Subject<void>,
    private readonly _onCloseStart: BehaviorSubject<boolean>
  ) {}

  private readonly _onClose = new Subject<boolean>();
  private readonly _onAction = new Subject<void>();

  /**
   * Observable that emits when the snackbar is opened. Completes after emitting the first value.
   */
  public readonly onOpen = this._onOpen.asObservable();
  /**
   * Observable that emits when the snackbar is closed and all animations have finished. Emits a boolean value indicating whether the snackbar was closed as a result of the user clicking the action button (true) or not (false). Completes after emitting the first value.
   */
  public readonly onClose = this._onClose.asObservable();
  /**
   * Observable that emits when the snackbar action is triggered, before the snackbar starts closing. Completes when the snackbar is closed, regardless of whether any value was emitted.
   */
  public readonly onAction = this._onAction.asObservable();
  /**
   * Observable that emits when the snackbar starts the closing process. Emits a boolean value indicating whether the closing was triggered by the user clicking the action button (true) or not (false). Completes after emitting the first value.
   */
  public readonly onCloseStart = this._onCloseStart.asObservable();

  /**
   * The instance of the component rendered inside the snackbar.
   */
  public readonly instance!: T;

  /**
   * Closes the snackbar, optionally indicating that the action was triggered.
   * @param withAction A boolean value indicating whether the snackbar is being closed as a result of the user clicking the action button (true) or not (false).
   */
  close(withAction = false): void {
    if (this.isClosed) return;
    this.dismiss(withAction);
    if (withAction) {
      this._onAction.next();
    }
    this._onAction.complete();
  }

  /**
   * Marks the snackbar as closed after the closing animation has finished.
   * @param withAction
   * @returns
   */
  markAsClosed(withAction = false): void {
    if (this.isClosed) return;
    this._onClose.next(withAction);
    this._onClose.complete();
    this._isClosed = true;
  }

  private _isClosed = false;
  /**
   * Indicates whether the snackbar has been closed and the closing animation has finished.
   */
  public get isClosed(): boolean {
    return this._isClosed;
  }
}
