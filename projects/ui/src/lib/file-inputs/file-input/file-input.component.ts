import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    Input,
    ContentChild,
    TemplateRef,
    forwardRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArdColorInputPlaceholderTemplateDirective } from '../../inputs/color-input/color-input.directives';
import { ComponentColor } from '../../types/colors.types';
import {
    FormElementAppearance,
    FormElementVariant,
} from '../../types/theming.types';
import { _FileInputComponentBase } from '../file-input-base';
import {
    FileInputBrowseContext,
    FileInputFileAmountContext,
    FileInputFilesContext,
} from '../file-input-types';
import {
    ArdFileInputPrefixTemplateDirective,
    ArdFileInputSuffixTemplateDirective,
    ArdiumFileInputDragoverContentTemplateDirective,
    ArdiumFileInputIdleContentTemplateDirective,
    ArdiumFileInputUploadedContentTemplateDirective,
} from './file-input.directives';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

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
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;

    //! other inputs
    @Input() inputAttrs: { [key: string]: any } = {};

    //! placeholder
    @Input() placeholder: string = '';

    @ContentChild(ArdColorInputPlaceholderTemplateDirective, {
        read: TemplateRef,
    })
    placeholderTemplate?: TemplateRef<any>;

    get shouldDisplayPlaceholder(): boolean {
        return Boolean(this.placeholder) && !this.value;
    }

    //! clear button
    private _clearable: boolean = true;
    @Input()
    get clearable(): boolean {
        return this._clearable;
    }
    set clearable(v: any) {
        this._clearable = coerceBooleanProperty(v);
    }

    @Input() clearButtonTitle: string = this.DEFAULTS.clearButtonTitle;

    get shouldShowClearButton(): boolean {
        return this._clearable && !this.disabled && Boolean(this.value);
    }
    onClearButtonClick(event: MouseEvent): void {
        event.stopPropagation();
        this.clear();
        this.focus();
    }

    //! clear function
    clear(): void {
        if (!this.clearable) return;

        this.writeValue(null);
        this._emitChange();
        this.clearEvent.emit();
    }

    @Output('clear') clearEvent = new EventEmitter<any>();

    //! state
    private _touched: boolean = false;
    get touched(): boolean {
        return this._touched;
    }
    private set touched(state: boolean) {
        this._touched = state;
    }

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
