import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation, computed, input, output, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTabComponent {
  protected _disabled: boolean = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(v: any) {
    this._disabled = coerceBooleanProperty(v);
  }
  protected _selected: boolean = false;
  @Input()
  @HostBinding('class.ard-tab-selected')
  get selected(): boolean {
    return this._selected;
  }
  set selected(v: any) {
    this._selected = coerceBooleanProperty(v);
  }

  readonly focused = signal<boolean>(false);

  readonly _label = input<string | null>(null, { alias: 'label' });
  readonly label = computed(() => this._label() ?? this.tabId());

  readonly tabId = input.required<string>();

  readonly focusEvent = output<void>();
  readonly blurEvent = output<void>();
  readonly selectedChange = output<boolean>();
}
