import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
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

  readonly selected = signal<boolean>(false);
  @Input('selected')
  set _selected(v: any) {
    this.selected.set(coerceBooleanProperty(v));
  }

  setSelected(state: boolean): void {
    this.selected.set(state);
    this._emitChange();
  }

  @HostBinding('class.ard-tab-selected')
  get _selectedHostAttribute() {
    return this.selected();
  }

  private _emitChange(): void {
    this.selectedChange.emit(this.selected());
  }

  readonly focused = signal<boolean>(false);

  readonly _label = input<string | null>(null, { alias: 'label' });
  readonly label = computed(() => this._label() ?? this.tabId());

  readonly tabId = input.required<string>();

  readonly focusEvent = output<void>();
  readonly blurEvent = output<void>();
  readonly selectedChange = output<boolean>();
}
