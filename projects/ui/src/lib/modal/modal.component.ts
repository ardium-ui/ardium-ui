import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, ViewChild, ViewContainerRef, AfterViewInit, Type, ChangeDetectorRef, ComponentRef, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ard-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumModalComponent implements AfterViewInit {

    constructor(
        private _cd: ChangeDetectorRef
    ) {}

    @ViewChild('view', { read: ViewContainerRef }) private _viewContainer!: ViewContainerRef;

    @Input() modalTitle: string = 'New Modal';
    @Input() closable: boolean = true;
    @Input() backdropClose: boolean = true;
    @Input() component!: Type<any>;

    private _closeSubject = new Subject<null>();
    closeEvent = this._closeSubject.asObservable();

    close(): void {
        this._closeSubject.next(null);
    }

    ngAfterViewInit(): void {
        this._viewContainer.createComponent(this.component);
        this._cd.detectChanges();
    }
}
