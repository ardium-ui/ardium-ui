import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, OnInit, ContentChild, ViewChild, ElementRef } from '@angular/core';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaDroppedContentTemplateDirective, ArdiumFileDropAreaIdleContentTemplateDirective } from './file-drop-area.directives';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'ard-file-drop-area',
  templateUrl: './file-drop-area.component.html',
  styleUrls: ['./file-drop-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumFileDropAreaComponent extends _NgModelComponentBase implements OnInit {
    @ViewChild('fileInput') fileInputEl!: ElementRef<HTMLInputElement>;

    @Input() htmlId: string = crypto.randomUUID();
    @Input() name?: string;

    ngOnInit(): void {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            console.error(new Error("Cannot use Ardium UI file features because this browser does not support them!"))
        }
    }

    //! value
    private _value?: File;
    @Input()
    get value(): File | undefined { return this._value; }
    set value(v: File | undefined) {
        this.writeValue(v);
    }

    writeValue(v: File | undefined): void {
        this._writeValue(v, false);
    }
    private _writeValue(v: File | undefined, emitEvents: boolean = true): void {
        this._value = v;

        if (emitEvents) {
            this._emitChange();
        }
    }

    protected _emitChange(): void { //TODO
        
    }

    //! temporary value
    //for drag event handling
    private _draggedFile?: File;

    //! triggering file dialog
    private _wasMousedownOnElement: true | null = null;
    onMousedown(): void {
        this._wasMousedownOnElement = true;
    }
    onMouseup(): void {
        if (!this._wasMousedownOnElement) return;
        this._wasMousedownOnElement = null;

        this.fileInputEl.nativeElement.click();
    }

    //! event handlers
    onDragover(event: DragEvent): void {

    }
    onDrop(event: DragEvent): void {

    }
    onInputChange(event: InputEvent): void {

    }

    private _updateElementValue(): void {

    }

    //! templates
    @ContentChild(ArdiumFileDropAreaIdleContentTemplateDirective, { read: TemplateRef }) idleTemplate: TemplateRef<any> | null = null;
    @ContentChild(ArdiumFileDropAreaDragoverContentTemplateDirective, { read: TemplateRef }) dragoverTemplate: TemplateRef<any> | null = null;
    @ContentChild(ArdiumFileDropAreaDroppedContentTemplateDirective, { read: TemplateRef }) droppedrTemplate: TemplateRef<any> | null = null;
}
