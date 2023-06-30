import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { FormElementVariant } from '../types/theming.types';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';

@Directive()
export abstract class _FileInputComponentBase extends _NgModelComponentBase implements OnInit {
    @ViewChild('fileInput') fileInputEl!: ElementRef<HTMLInputElement>;

    @Input() htmlId: string = crypto.randomUUID();
    @Input() name?: string;

    ngOnInit(): void {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            console.error(new Error("Cannot use Ardium UI file features because this browser does not support them!"))
        }
    }

    //! appearance
    //all handled in ard-form-field-frame component
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.None;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-variant-${this.variant}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! value
    protected _value?: FileList;
    @Input()
    get value(): FileList | undefined { return this._value; }
    set value(v: FileList | undefined) {
        this.writeValue(v);
    }

    @Output() valueChange = new EventEmitter<FileList | undefined>();
    @Output('change') changeEvent = new EventEmitter<FileList | undefined>();
    @Output('dragFiles') dragFilesEvent = new EventEmitter<FileList | undefined>();

    writeValue(v: File | FileList | undefined): void {
        this._writeValue(v, false);
    }
    protected _writeValue(v: File | FileList | undefined, emitEvents: boolean = true): void {
        if (v instanceof File) {
            const file = v;
            v = new FileList();
            v[0] = file;
        }

        this._value = v;

        if (emitEvents) {
            this._emitChange();
        }
    }

    protected _emitChange(): void { //TODO

    }

    openBrowseDialog(): void {
        this.fileInputEl.nativeElement.click();
    }

    //! temporary value
    //for drag event handling
    protected _draggedFiles?: FileList;

    //! triggering file dialog
    protected _wasMousedownOnElement: true | null = null;
    onMousedown(): void {
        this._wasMousedownOnElement = true;
    }
    onMouseup(): void {
        if (!this._wasMousedownOnElement) return;
        this._wasMousedownOnElement = null;

        this.openBrowseDialog();
    }

    //! event handlers
    onDragover(event: DragEvent): void {  //TODO

    }
    onDrop(event: DragEvent): void { //TODO

    }
    onInputChange(event: InputEvent): void { //TODO

    }

    protected _updateElementValue(): void {
        this.fileInputEl.nativeElement.files = this.value ?? null;
    }
}
