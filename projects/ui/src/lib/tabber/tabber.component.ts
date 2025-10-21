import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  contentChildren,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';
import { OneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { ArdiumTabComponent } from './tab/tab.component';
import { ARD_TABBER_DEFAULTS } from './tabber.defaults';

@Component({
  standalone: false,
  selector: 'ard-tabber',
  templateUrl: './tabber.component.html',
  styleUrl: './tabber.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTabberComponent implements AfterContentInit {
  protected readonly _DEFAULTS = inject(ARD_TABBER_DEFAULTS);

  public readonly tabs = contentChildren(ArdiumTabComponent, { descendants: true });

  readonly currentTab = signal<ArdiumTabComponent | null>(null);
  readonly currentFocusedTab = signal<ArdiumTabComponent | null>(null);

  readonly initialTab = input<string | undefined>(undefined);

  ngAfterContentInit(): void {
    let selectedCmp: ArdiumTabComponent | null = null;
    for (const cmp of this.tabs()) {
      if (cmp.selected()) {
        // ensure only one tab is selected
        if (selectedCmp) {
          cmp.selected.set(false);
        }

        selectedCmp = cmp;
      }

      cmp.focusEvent.subscribe(() => {
        this.focusEvent.emit(cmp.tabId());
      });
      cmp.blurEvent.subscribe(() => {
        this.blurEvent.emit(cmp.tabId());
      });
      cmp.selectedChange.subscribe(isSelected => {
        if (!isSelected) return;
        this.changeTab.emit(cmp.tabId());
      });
    }

    if (!selectedCmp) {
      const initiallySelectedTab = this.tabs().find(tab => tab.tabId() === this.initialTab());
      selectedCmp = initiallySelectedTab ?? this.tabs()[0] ?? null;

      if (selectedCmp) {
        selectedCmp.selected.set(true);
      }
    }

    this.currentTab.set(selectedCmp);
  }

  onTabClick(tab: ArdiumTabComponent): void {
    const curr = this.currentTab();
    if (curr) {
      curr.selected.set(false);
      curr.selectedChange.emit(false);
    }
    this.currentTab.set(tab);

    tab.selected.set(true);
    tab.selectedChange.emit(true);
  }
  onTabFocus(tab: ArdiumTabComponent): void {
    tab.focusEvent.emit();
    tab.focused.set(true);

    this.currentFocusedTab.set(tab);
  }
  onTabBlur(tab: ArdiumTabComponent): void {
    tab.blurEvent.emit();
    tab.focused.set(false);

    this.currentFocusedTab.set(null);
  }

  readonly focusEvent = output<string>({ alias: 'focus' });
  readonly blurEvent = output<string>({ alias: 'blur' });
  readonly changeTab = output<string>();

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed(() => [`ard-color-${this.color()}`].join(' '));

  //! tab container settings
  readonly stretchTabs = input<boolean, BooleanLike>(this._DEFAULTS.stretchTabs, { transform: v => coerceBooleanProperty(v) });
  readonly uniformTabWidths = input<boolean, BooleanLike>(this._DEFAULTS.uniformTabWidths, { transform: v => coerceBooleanProperty(v) });
  readonly tabAlignment = input<OneAxisAlignment>(this._DEFAULTS.tabAlignment);

  readonly tabContainerClasses = computed(() =>
    [
      this.uniformTabWidths() && !this.stretchTabs() ? 'ard-uniform-tab-widths' : '',
      this.stretchTabs() ? 'ard-stretch-tabs' : '',
      this.stretchTabs() ? '' : `ard-tab-align-${this.tabAlignment()}`,
    ].join(' ')
  );

  //! other
  readonly tabIndex = input<number | string>(0);
}
