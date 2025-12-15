import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { BooleanLike, coerceBooleanProperty } from '@ardium-ui/devkit';
import { OneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { ArdiumTabComponent } from './tab/tab.component';
import { ARD_TABBER_DEFAULTS } from './tabber.defaults';
import { ArdTabberLabelTemplateDirective } from './tabber.directives';
import { TabberLabelContext } from './tabber.types';

@Component({
  standalone: false,
  selector: 'ard-tabber',
  templateUrl: './tabber.component.html',
  styleUrl: './tabber.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTabberComponent implements AfterContentInit, OnChanges {
  protected readonly _DEFAULTS = inject(ARD_TABBER_DEFAULTS);

  public readonly tabs = contentChildren(ArdiumTabComponent, { descendants: true });

  readonly selectedTabId = model<string | null>(null, { alias: 'selectedTab' });

  readonly selectedTab = computed<ArdiumTabComponent | null>(
    () => this.tabs().find(tab => tab.tabId() === this.selectedTabId()) ?? null
  );

  readonly focusedTabId = signal<string | null>(null);

  readonly focusedTab = computed<ArdiumTabComponent | null>(
    () => this.tabs().find(tab => tab.tabId() === this.focusedTabId()) ?? null
  );

  readonly focusedTabIdChange = output<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTabId']) {
      const newTabId = changes['selectedTabId'].currentValue;
      if (newTabId !== null) {
        const newTab = this.tabs().find(tab => tab.tabId() === newTabId);
        if (!newTab) {
          console.error(`ARD-NF6000: Trying to select a tab with id '${newTabId}' that does not exist.`);
          return;
        }
        const oldTabId = changes['selectedTabId'].previousValue;
        const oldTab = this.tabs().find(tab => tab.tabId() === oldTabId);
        if (oldTab) this._unselectSpecificTab(oldTab);
        this._selectNewTab(newTab);
      }
    }
  }

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

      // subscribe to events
      cmp.focusEvent.subscribe(() => {
        this.focusEvent.emit(cmp.tabId());
      });
      cmp.blurEvent.subscribe(() => {
        this.blurEvent.emit(cmp.tabId());
      });
      cmp.selectedChangeInternal$.subscribe(isSelected => {
        if (!isSelected) {
          this.selectedTabId.set(null);
          return;
        }
        this.selectTab(cmp);
      });
    }

    // if no tab is selected, select the initial tab or the first tab
    if (!selectedCmp) {
      const initiallySelectedTab = this.tabs().find(tab => tab.tabId() === this.initialTab());
      selectedCmp = initiallySelectedTab ?? this.tabs()[0] ?? null;

      if (selectedCmp) {
        selectedCmp.selected.set(true);
      }
    }

    this.selectedTabId.set(selectedCmp.tabId());
  }

  selectTab(tab: ArdiumTabComponent): void {
    if (tab.tabId() === this.selectedTabId()) {
      return;
    }
    this._unselectCurrentTab(tab);
    this.selectedTabId.set(tab.tabId());
    this._selectNewTab(tab);
  }
  private _unselectSpecificTab(tab: ArdiumTabComponent): void {
    tab.selected.set(false);
    tab.selectedChange.emit(false);
  }
  private _unselectCurrentTab(referenceTab?: ArdiumTabComponent): void {
    const curr = this.selectedTab();
    if (curr && (!referenceTab || curr.tabId() !== referenceTab.tabId())) {
      this._unselectSpecificTab(curr);
    }
  }
  private _selectNewTab(tab: ArdiumTabComponent): void {
    tab.selected.set(true);
    tab.selectedChange.emit(true);
  }
  onTabFocus(tab: ArdiumTabComponent): void {
    tab.focusEvent.emit();
    tab.focused.set(true);

    this.focusedTabId.set(tab.tabId());
  }
  onTabBlur(tab: ArdiumTabComponent): void {
    tab.blurEvent.emit();
    tab.focused.set(false);

    this.focusedTabId.set(null);
  }

  readonly focusEvent = output<string>({ alias: 'focus' });
  readonly blurEvent = output<string>({ alias: 'blur' });

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed(() => [`ard-color-${this.color()}`].join(' '));

  //! tab container settings
  readonly stretchTabs = input<boolean, BooleanLike>(this._DEFAULTS.stretchTabs, { transform: v => coerceBooleanProperty(v) });
  readonly uniformTabWidths = input<boolean, BooleanLike>(this._DEFAULTS.uniformTabWidths, {
    transform: v => coerceBooleanProperty(v),
  });
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

  //! tab label template
  readonly labelTemplate = contentChild(ArdTabberLabelTemplateDirective);

  readonly tabsWithTemplates = computed(() =>
    this.tabs().map(tab => ({
      tab,
      template: typeof tab.label() === 'string' ? null : (tab.label() as TemplateRef<any>),
      templateContext:
        typeof tab.label() === 'string'
          ? ({ $implicit: tab.label(), tabId: tab.tabId(), label: tab.label() } as TabberLabelContext)
          : null,
    }))
  );
}
