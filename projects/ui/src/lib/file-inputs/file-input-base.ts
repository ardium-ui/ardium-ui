import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, viewChild, input, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';

@Directive()
export abstract class _FileInputComponentBase extends _NgModelComponentBase implements OnInit, AfterViewInit {
  readonly fileInputEl = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly htmlId = input<string>(crypto.randomUUID());
  readonly name = input<string>('');

  ngOnInit(): void {
    if (!(window.File && window.FileReader && window.Blob)) {
      console.error(new Error('Cannot use Ardium UI file features because this browser does not support them!')); //TODO error
    }
  }
  protected _wasViewInit: boolean = false;
  ngAfterViewInit(): void {
    this._wasViewInit = true;

    this._updateElementValue();
  }

  //! appearance
  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! settings
  readonly multiple = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly blockAfterUpload = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  get shouldBeBlocked(): boolean {
    return this.blockAfterUpload() && isDefined(this.value);
  }

  //! value
  protected _value: File[] | null = null;
  @Input()
  get value(): File[] | null {
    return this._value;
  }
  set value(v: File | File[] | null) {
    this.writeValue(v);
  }

  @Output() valueChange = new EventEmitter<File[] | null>();
  @Output('change') changeEvent = new EventEmitter<File[] | null>();
  @Output('dragFiles') dragFilesEvent = new EventEmitter<File[] | null>();

  protected _valueBeforeInit: File[] | null = null;
  writeValue(v: File | File[] | null): void {
    this._writeValue(v, false);
  }
  protected _writeValue(v: File | File[] | null, emitEvents: boolean = true): void {
    if (v instanceof File) {
      v = [v];
    }

    this.currentViewState.set('uploaded');
    this._value = v;

    if (this._wasViewInit) this._updateElementValue();

    if (emitEvents) {
      this._emitChange();
    }
  }

  protected _emitChange(): void {
    const v = this.value;
    this._onChangeRegistered?.(v);
    this.valueChange.emit(v);
    this.changeEvent.emit(v);
  }

  openBrowseDialog(): void {
    this.fileInputEl()?.nativeElement.click();
  }

  //! temporary value
  //for drag event handling
  protected _draggedFiles: number | null = null;

  //! view state
  readonly currentViewState = signal<'idle' | 'dragover' | 'uploaded'>('idle');
  private _beforeDragoverState: 'idle' | 'uploaded' = 'idle';

  //! event handlers
  onDragover(event: DragEvent): void {
    event.preventDefault();
    if (this.shouldBeBlocked) {
      if (!event.dataTransfer) return;

      event.dataTransfer.dropEffect = 'none';
      return;
    }
    if (this.currentViewState() === 'dragover') return;

    this._draggedFiles = this._countDragenterFiles(event.dataTransfer);

    if (!this._draggedFiles) return;

    this._beforeDragoverState = this.currentViewState() as 'idle' | 'uploaded';
    this.currentViewState.set('dragover');
  }
  onDragleave(): void {
    if (this.shouldBeBlocked) return;
    if (this.currentViewState() !== 'dragover') return;

    this.currentViewState.set(this._beforeDragoverState);
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (this.shouldBeBlocked) return;

    const filelist = event.dataTransfer?.files;
    if (!filelist) {
      this.currentViewState.set('idle');
      return;
    }
    const files = Array.from(filelist);
    if (!files) {
      this.currentViewState.set('idle');
      return;
    }

    this.currentViewState.set('uploaded');
    this._writeValue(files);
  }
  onInputChange(): void {
    const files = Array.from(this.fileInputEl()?.nativeElement.files ?? []);
    if (files.length == 0) {
      this._writeValue(null);
      this.currentViewState.set('idle');
      return;
    }
    this._writeValue(files);
    this.currentViewState.set('uploaded');
  }

  //! helpers
  protected _countDragenterFiles(data: DataTransfer | null): number | null {
    if (!data) return null;

    return Array.from(data.items).filter(item => item.kind == 'file').length;
  }

  protected _updateElementValue(): void {
    const v = this.value;

    const inputEl = this.fileInputEl()?.nativeElement;
    if (!inputEl) return;
    if (!v) {
      inputEl.files = null;
      return;
    }

    const dataTransfer = new DataTransfer();
    for (const file of v) {
      dataTransfer.items.add(file);
    }
    inputEl.files = dataTransfer.files;
  }
}
