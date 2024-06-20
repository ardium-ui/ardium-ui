import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
  computed,
  contentChild,
  forwardRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isAnyString, isDefined } from 'simple-bool';
import { _NgModelComponentBase } from '../../_internal/ngmodel-component';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { Nullable } from '../../types/utility.types';
import {
  ArdPasswordInputPlaceholderTemplateDirective,
  ArdPasswordInputPrefixTemplateDirective,
  ArdPasswordInputRevealButtonTemplateDirective,
  ArdPasswordInputSuffixTemplateDirective,
} from './password-input.directives';
import { PasswordInputRevealButtonContext } from './password-input.types';

@Component({
  selector: 'ard-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumPasswordInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumPasswordInputComponent extends _NgModelComponentBase implements ControlValueAccessor, OnInit, OnDestroy {
  //! input view
  readonly textInputEl = viewChild<ElementRef<HTMLInputElement>>('textInput');

  ngOnInit(): void {
    this._setInputAttributes();
  }

  readonly placeholder = input<string>('');
  readonly inputId = input<Nullable<string>>();

  //! prefix & suffix
  readonly prefixTemplate = contentChild<TemplateRef<ArdPasswordInputPrefixTemplateDirective>>(
    TemplateRef<ArdPasswordInputPrefixTemplateDirective>
  );
  readonly suffixTemplate = contentChild<TemplateRef<ArdPasswordInputSuffixTemplateDirective>>(
    TemplateRef<ArdPasswordInputSuffixTemplateDirective>
  );

  //! placeholder
  readonly placeholderTemplate = contentChild<TemplateRef<ArdPasswordInputPlaceholderTemplateDirective>>(
    TemplateRef<ArdPasswordInputPlaceholderTemplateDirective>
  );

  readonly shouldDisplayPlaceholder = computed(() => !!this.placeholder() && !this.value());

  //! revealing
  readonly revealable = input<boolean, any>(true, { transform: v => coerceBooleanProperty(v) });
  readonly holdToReveal = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly autoHideTimeoutMs = input<Nullable<number>, any>(undefined, { transform: v => coerceNumberProperty(v, undefined) });

  readonly revealed = model<boolean>(false);

  private _hideTimeout: NodeJS.Timeout | null = null;
  toggleReveal(newState = !this.revealed()): void {
    this.revealed.set(newState);

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
    const timeout = this.autoHideTimeoutMs();
    if (timeout && newState) {
      this._hideTimeout = setTimeout(() => this.revealed.set(false), timeout);
    }
  }

  ngOnDestroy(): void {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  readonly revealTemplate = contentChild<TemplateRef<ArdPasswordInputRevealButtonTemplateDirective>>(
    TemplateRef<ArdPasswordInputRevealButtonTemplateDirective>
  );

  readonly revealButtonContext = computed(
    (): PasswordInputRevealButtonContext => ({
      $implicit: this.revealed(),
    })
  );

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      this.compact() ? 'ard-compact' : '',
      this.revealable() ? 'ard-revealable' : '',
    ].join(' ')
  );

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>({});

  //! control value accessor's write value implementation
  writeValue(v: any) {
    if (!isAnyString(v) && isDefined(v)) {
      console.error(new Error(`Error using <ard-password-input>: Unexpected value type ${typeof v}.`)); //TODO error
      return;
    }
    this._writeValue(v);
  }
  protected _writeValue(v: string | null | undefined): boolean {
    const oldVal = this.value();
    this.value.set(v);
    return oldVal !== v;
  }
  //! value two-way binding
  readonly value = model<Nullable<string>>();

  //! event handlers
  onInput(newVal: string): void {
    const valueHasChanged = this._writeValue(newVal);
    if (!valueHasChanged) return;
    this._emitChange();
  }
  protected _emitChange(): void {
    const v = this.value();
    this._onChangeRegistered?.(v);
  }
  //focus, blur, change
  onChange(event: Event): void {
    event.stopPropagation();
    this._emitChange();
  }

  // copy
  onCopy(event: ClipboardEvent): void {
    const textInputEl = this.textInputEl();
    const v = this.value();
    if (
      v &&
      textInputEl &&
      //does the selection cover the entire input
      ((textInputEl.nativeElement.selectionStart === 0 &&
        textInputEl.nativeElement.selectionEnd === textInputEl.nativeElement.value.length) ||
        //or is zero-wide
        textInputEl.nativeElement.selectionStart === textInputEl.nativeElement.selectionEnd)
    ) {
      event.clipboardData?.setData('text/plain', v);
      event.preventDefault();
    }
  }
  //! helpers
  protected _setInputAttributes() {
    const input = this.textInputEl()?.nativeElement;
    if (!input) return;

    const attributes: Record<string, string> = {
      type: 'text',
      autocorrect: 'off',
      autocapitalize: 'off',
      autocomplete: 'off',
      tabindex: String(this.tabIndex()),
      ...this.inputAttrs(),
    };

    for (const key of Object.keys(attributes)) {
      input.setAttribute(key, String(attributes[key]));
    }
  }
}
