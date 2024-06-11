import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  ViewEncapsulation,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ArdColorInputPlaceholderTemplateDirective } from '../../inputs/color-input/color-input.directives';
import { ComponentColor } from '../../types/colors.types';
import { FormElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _FileInputComponentBase } from '../file-input-base';
import { FileInputBrowseContext, FileInputFileAmountContext, FileInputFilesContext } from '../file-input-types';
import {
  ArdFileInputPrefixTemplateDirective,
  ArdFileInputSuffixTemplateDirective,
  ArdiumFileInputDragoverContentTemplateDirective,
  ArdiumFileInputIdleContentTemplateDirective,
  ArdiumFileInputUploadedContentTemplateDirective,
} from './file-input.directives';

@Component({
  selector: 'ard-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumFileInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumFileInputComponent extends _FileInputComponentBase {
  readonly DEFAULTS = {
    clearButtonTitle: 'Clear',
  };

  //! appearance
  //all handled in ard-form-field-frame component
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  //! other inputs
  readonly inputAttrs = input<Record<string, any>>({});

  //! placeholder
  readonly placeholder = input<string>('');

  @ContentChild(ArdColorInputPlaceholderTemplateDirective, {
    read: TemplateRef,
  })
  placeholderTemplate?: TemplateRef<any>;

  get shouldDisplayPlaceholder(): boolean {
    return Boolean(this.placeholder()) && !this.value;
  }

  //! clear button
  readonly clearable = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly clearButtonTitle = input<string>(this.DEFAULTS.clearButtonTitle);

  get shouldShowClearButton(): boolean {
    return this.clearable() && !this.disabled() && Boolean(this.value);
  }
  onClearButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clear();
    this.focus();
  }

  //! clear function
  clear(): void {
    if (!this.clearable()) return;

    this.writeValue(null);
    this._emitChange();
    this.clearEvent.emit();
  }

  readonly clearEvent = output();

  //! state
  readonly touched = signal<boolean>(false);

  //! prefix & suffix
  @ContentChild(ArdFileInputPrefixTemplateDirective, { read: TemplateRef })
  prefixTemplate?: TemplateRef<any>;
  @ContentChild(ArdFileInputSuffixTemplateDirective, { read: TemplateRef })
  suffixTemplate?: TemplateRef<any>;
  //! templates
  @ContentChild(ArdiumFileInputIdleContentTemplateDirective, {
    read: TemplateRef,
  })
  idleTemplate: TemplateRef<FileInputBrowseContext> | null = null;
  @ContentChild(ArdiumFileInputDragoverContentTemplateDirective, {
    read: TemplateRef,
  })
  dragoverTemplate: TemplateRef<FileInputFilesContext> | null = null;
  @ContentChild(ArdiumFileInputUploadedContentTemplateDirective, {
    read: TemplateRef,
  })
  uploadedTemplate: TemplateRef<FileInputFilesContext> | null = null;

  getIdleContext(): FileInputBrowseContext {
    return {
      browse: () => {
        this.openBrowseDialog();
      },
    };
  }
  getDragoverContext(): FileInputFileAmountContext {
    return {
      amount: this._draggedFiles!,
    };
  }
  getUploadedContext(): FileInputFilesContext {
    const files = this.value!;
    return {
      $implicit: files,
      amount: files.length,
      files,
    };
  }
}
