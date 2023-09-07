import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'ard-icon',
    templateUrl: `./icon.component.html`,
    styleUrls: ['./icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumIconComponent implements AfterViewInit {
    @Input() ariaLabel?: string;
    @Input() icon?: string | null;

    @ViewChild('contentWrapper') contentWrapper!: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        if (!this.icon && !this.contentWrapper.nativeElement.innerText) console.warn(`Using <ard-icon> without specifying the [icon] field.`);
    }
}
