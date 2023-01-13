import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ard-overlay',
  template: `
    <ng-template #container></ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class _OverlayComponent {
    @ViewChild('container', { read: ViewContainerRef }) public container!: ViewContainerRef;
}
