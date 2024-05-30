import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation, computed, effect, input, model, output, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTabComponent {
  readonly disabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  @HostBinding('class.ard-tab-selected')
  readonly selected = model<any>(false);
  
  constructor() {
    effect(() => {
      this.selected.set(coerceBooleanProperty(this.selected()))
    }, { allowSignalWrites: true });
  }

  readonly focused = signal<boolean>(false);

  readonly _label = input<string | null>(null, { alias: 'label' });
  readonly label = computed(() => this._label() ?? this.tabId());

  readonly tabId = input.required<string>();

  readonly focusEvent = output<void>();
  readonly blurEvent = output<void>();
  readonly selectedChange = output<boolean>();
}
