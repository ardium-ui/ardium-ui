import { Directive, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren, computed, input, signal } from '@angular/core';
import { coerceNumberProperty } from '@ardium-ui/devkit';
import { _DisablableComponentBase } from './disablable-component';

@Directive()
export abstract class _FocusableComponentBase extends _DisablableComponentBase {
  //! make the component focusable programmatically
  @ViewChildren('focusableElement')
  private readonly _focusableElement!: QueryList<ElementRef<HTMLElement>>;

  /**
   * Focuses the correct element in the component.
   */
  public focus(): void {
    this._focusableElement?.first?.nativeElement.focus();
  }
  /**
   * Focuses the first of all available elements in the component.
   */
  public focusFirst(): void {
    this.focus();
  }
  /**
   * Focuses the last of all available elements in the component.
   */
  public focusLast(): void {
    this._focusableElement?.last?.nativeElement.focus();
  }
  /**
   * Blurs all focusable elements in the component.
   */
  public blur(): void {
    this._focusableElement?.forEach(el => el.nativeElement.blur());
  }

  //! tabindex
  /**
   * The component's overall tab index. If the component is disabled, it is always `-1`. Coercible into a number, defaults to `0`.
   */
  readonly tabIndex = computed(() => (this.disabled() ? -1 : this._tabIndex()));
  readonly _tabIndex = input<any, number>(0, { alias: 'tabIndex', transform: v => coerceNumberProperty(v) });

  //! events
  /**
   * The event emitter responsible for firing `focus` events.
   */
  @Output('focus') focusEvent = new EventEmitter<FocusEvent>();
  /**
   * The event emitter responsible for firing `blur` events.
   */
  @Output('blur') blurEvent = new EventEmitter<FocusEvent>();

  //! focus event handlers
  /**
   * Whether the component is currently focused.
   */
  public isFocused: boolean = false;

  /**
   * Function to handle when an element is focused. Sets `isFocused` and fires the `focus` event.
   * @param event The focus event to emit.
   */
  onFocus(event: FocusEvent) {
    this.isFocused = true;
    this.focusEvent.emit(event);
  }
  /**
   * Function to handle when an element is blurred. Sets `isFocused` and fires the `blur` event.
   * @param event The focus event to emit.
   */
  onBlur(event: FocusEvent) {
    this.isFocused = false;
    this.blurEvent.emit(event);
  }
}
