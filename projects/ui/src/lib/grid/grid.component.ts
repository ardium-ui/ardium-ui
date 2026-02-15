import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanLike, coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isNull, isNumber } from 'simple-bool';
import { ArdiumBreakpointService } from '../breakpoints/breakpoint.service';
import { ArdBreakpointsConfig } from '../breakpoints/breakpoints';
import { ARD_GRID_DEFAULTS } from './grid.defaults';
import {
  ArdGridAlign,
  ArdGridJustify,
  ArdGridSize,
  ArdGridWrap,
  isArdGridAlign,
  isArdGridJustify,
  isArdGridSize,
  isArdGridWrap,
} from './grid.types';
import { fillInMissingBreakpoints, transformResponsiveValue } from './grid.utils';

@Component({
  selector: 'ard-grid',
  standalone: false,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ard-grid',
    '[style]': 'currentStyle()',
    '[class.ard-grid__container]': 'container()',
    '[class.ard-grid__item]': '!container()',
    '[class.ard-grid__item-grow]': '!container() && currentSize() === "grow"',
    '[class.ard-grid__item-auto]': '!container() && currentSize() === "auto"',
  },
})
export class ArdiumGridComponent implements AfterContentInit {
  protected readonly _DEFAULTS = inject(ARD_GRID_DEFAULTS);

  private readonly _breakpointService = inject(ArdiumBreakpointService);

  constructor() {
    effect(() => {
      this._updateChildrenStyles();
    });
  }

  private _wasContentInitialized = false;
  ngAfterContentInit() {
    this._wasContentInitialized = true;
    this._updateChildrenStyles();
  }

  //! is container
  readonly container = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  //! configurations
  readonly columns = input<Required<ArdBreakpointsConfig<number>>, number | string | ArdBreakpointsConfig<number>>(
    parseNumberOrBreakpointConfig(this._DEFAULTS.columns, this._breakpointService.breakpoints),
    { transform: value => parseNumberOrBreakpointConfig(value, this._breakpointService.breakpoints) }
  );
  readonly size = input<
    Required<ArdBreakpointsConfig<number | ArdGridSize>>,
    number | ArdGridSize | string | ArdBreakpointsConfig<number>
  >(parseSizeOrBreakpointConfig(this._DEFAULTS.size, this._breakpointService.breakpoints), {
    transform: value => parseSizeOrBreakpointConfig(value, this._breakpointService.breakpoints),
  });

  readonly reverse = input<Required<ArdBreakpointsConfig<boolean>>, boolean | string | ArdBreakpointsConfig<boolean>>(
    parseBooleanOrBreakpointConfig(this._DEFAULTS.reverse, this._breakpointService.breakpoints),
    { transform: value => parseBooleanOrBreakpointConfig(value, this._breakpointService.breakpoints) }
  );

  readonly justifyContent = input<
    Required<ArdBreakpointsConfig<ArdGridJustify>>,
    ArdGridJustify | string | ArdBreakpointsConfig<ArdGridJustify>
  >(parseEnumOrBreakpointConfig(this._DEFAULTS.justifyContent, this._breakpointService.breakpoints, isArdGridJustify), {
    transform: value => parseEnumOrBreakpointConfig(value, this._breakpointService.breakpoints, isArdGridJustify),
  });

  readonly alignItems = input<
    Required<ArdBreakpointsConfig<ArdGridAlign>>,
    ArdGridAlign | string | ArdBreakpointsConfig<ArdGridAlign>
  >(parseEnumOrBreakpointConfig(this._DEFAULTS.alignItems, this._breakpointService.breakpoints, isArdGridAlign), {
    transform: value => parseEnumOrBreakpointConfig(value, this._breakpointService.breakpoints, isArdGridAlign),
  });

  readonly spacing = input<
    Required<ArdBreakpointsConfig<number | string>>,
    number | string | ArdBreakpointsConfig<number | string>
  >(parseCSSUnitOrBreakpointConfig(this._DEFAULTS.spacing, this._breakpointService.breakpoints)!, {
    transform: value => parseCSSUnitOrBreakpointConfig(value, this._breakpointService.breakpoints)!,
  });

  readonly columnSpacing = input<
    ArdBreakpointsConfig<number | string> | null,
    null | number | string | ArdBreakpointsConfig<number | string>
  >(parseCSSUnitOrBreakpointConfig(this._DEFAULTS.columnSpacing, this._breakpointService.breakpoints), {
    transform: value => parseCSSUnitOrBreakpointConfig(value, this._breakpointService.breakpoints),
  });

  readonly rowSpacing = input<
    ArdBreakpointsConfig<number | string> | null,
    null | number | string | ArdBreakpointsConfig<number | string>
  >(parseCSSUnitOrBreakpointConfig(this._DEFAULTS.rowSpacing, this._breakpointService.breakpoints), {
    transform: value => parseCSSUnitOrBreakpointConfig(value, this._breakpointService.breakpoints),
  });

  readonly wrap = input<Required<ArdBreakpointsConfig<ArdGridWrap>>, ArdGridWrap | string | ArdBreakpointsConfig<ArdGridWrap>>(
    parseEnumOrBreakpointConfig(this._DEFAULTS.wrap, this._breakpointService.breakpoints, isArdGridWrap),
    { transform: value => parseEnumOrBreakpointConfig(value, this._breakpointService.breakpoints, isArdGridWrap) }
  );

  //! inherited properties
  readonly inheritedColumns = signal<ArdBreakpointsConfig<number> | null>(null);
  readonly inheritedReverse = signal<ArdBreakpointsConfig<boolean> | null>(null);
  readonly inheritedJustifyContent = signal<ArdBreakpointsConfig<ArdGridJustify> | null>(null);
  readonly inheritedAlignItems = signal<ArdBreakpointsConfig<ArdGridAlign> | null>(null);
  readonly inheritedColumnSpacing = signal<ArdBreakpointsConfig<number | string> | null>(null);
  readonly inheritedRowSpacing = signal<ArdBreakpointsConfig<number | string> | null>(null);
  readonly inheritedWrap = signal<ArdBreakpointsConfig<ArdGridWrap> | null>(null);

  //! inherited or own properties
  readonly columnsOrInherited = computed(() => this.inheritedColumns() ?? this.columns());
  readonly reverseOrInherited = computed(() => this.inheritedReverse() ?? this.reverse());
  readonly justifyContentOrInherited = computed(() => this.inheritedJustifyContent() ?? this.justifyContent());
  readonly alignItemsOrInherited = computed(() => this.inheritedAlignItems() ?? this.alignItems());
  readonly columnSpacingOrInherited = computed(() => this.inheritedColumnSpacing() ?? this.columnSpacing());
  readonly rowSpacingOrInherited = computed(() => this.inheritedRowSpacing() ?? this.rowSpacing());
  readonly wrapOrInherited = computed(() => this.inheritedWrap() ?? this.wrap());

  //! computed properties
  readonly finalColumnSpacing = computed(() => this.columnSpacingOrInherited() ?? this.spacing());
  readonly finalRowSpacing = computed(() => this.rowSpacingOrInherited() ?? this.spacing());

  //! current values
  readonly currentColumns = computed(() => this.columnsOrInherited()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentSize = computed(() => this.size()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentReverse = computed(() => this.reverseOrInherited()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentJustifyContent = computed(
    () => this.justifyContentOrInherited()[this._breakpointService.currentBreakpoint() ?? 'xs']
  );
  readonly currentAlignItems = computed(() => this.alignItemsOrInherited()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentColumnSpacing = computed(() => this.finalColumnSpacing()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentRowSpacing = computed(() => this.finalRowSpacing()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentWrap = computed(() => this.wrapOrInherited()[this._breakpointService.currentBreakpoint() ?? 'xs']);

  readonly currentStyle = computed(() =>
    [
      this.container() ? `--ard-_grid-columns: ${this.currentColumns()}` : `--ard-_grid-size: ${this.currentSize()}`,
      this.container() ? `--ard-_grid-direction: ${this.currentReverse() ? 'row-reverse' : 'row'}` : '',
      this.container() ? `--ard-_grid-justify-content: ${this.currentJustifyContent()}` : '',
      this.container() ? `--ard-_grid-align-items: ${this.currentAlignItems()}` : '',
      this.container() ? `--ard-_grid-column-spacing: ${this.currentColumnSpacing()}` : '',
      this.container() ? `--ard-_grid-row-spacing: ${this.currentRowSpacing()}` : '',
      this.container() ? `--ard-_grid-wrap: ${this.currentWrap()}` : '',
    ]
      .filter(Boolean)
      .join(';')
  );

  //! inheriting styles for items
  readonly children = contentChildren(ArdiumGridComponent);

  private _updateChildrenStyles() {
    if (!this._wasContentInitialized) {
      return;
    }
    const containerChildren = this.children().filter(child => child !== this && child.container());

    for (const child of containerChildren) {
      child.inheritedColumns.set(this.columns());
      child.inheritedReverse.set(this.reverse());
      child.inheritedJustifyContent.set(this.justifyContent());
      child.inheritedAlignItems.set(this.alignItems());
      child.inheritedColumnSpacing.set(this.columnSpacing());
      child.inheritedRowSpacing.set(this.rowSpacing());
      child.inheritedWrap.set(this.wrap());
    }
  }
}

function parseNumberOrBreakpointConfig(
  value: number | string | ArdBreakpointsConfig<number>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<number>> {
  if (typeof value === 'number') {
    // If it's a number, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<number>(value, breakpoints, coerceNumberProperty);
}

function parseSizeOrBreakpointConfig(
  value: number | ArdGridSize | string | ArdBreakpointsConfig<number | ArdGridSize>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<number | ArdGridSize>> {
  if (typeof value === 'number' || isArdGridSize(value)) {
    // If it's a number or ArdGridSize, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<number | ArdGridSize>(value, breakpoints, v => {
    if (isArdGridSize(v)) {
      return v;
    }
    return coerceNumberProperty(v);
  });
}

function parseBooleanOrBreakpointConfig(
  value: boolean | string | ArdBreakpointsConfig<boolean>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<boolean>> {
  if (typeof value === 'boolean') {
    // If it's a boolean, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  if (value === '' || value === 'true') {
    return fillInMissingBreakpoints({ xs: true }, breakpoints);
  }
  return transformResponsiveValue<boolean>(value, breakpoints, v => v === 'true');
}

function parseCSSUnitOrBreakpointConfig(
  value: null | number | string | ArdBreakpointsConfig<string | number>,
  breakpoints: string[]
): Required<ArdBreakpointsConfig<string>> | null {
  if (isNull(value)) {
    return value;
  }
  if (isNumber(value)) {
    fillInMissingBreakpoints({ xs: value }, breakpoints);
  }
  return transformResponsiveValue<string | number, string>(value, breakpoints, v => {
    const num = coerceNumberProperty(v, NaN);
    return isNaN(num) ? v : `calc(var(--ard-grid-spacing-unit) * ${num})`;
  });
}

function parseEnumOrBreakpointConfig<T>(
  value: T | string | ArdBreakpointsConfig<T>,
  breakpoints: string[],
  isEnumValue: (val: any) => val is T
): Required<ArdBreakpointsConfig<T>> {
  if (isEnumValue(value)) {
    // If it's an enum value, apply it to all breakpoints
    return fillInMissingBreakpoints({ xs: value as T }, breakpoints);
  }
  return transformResponsiveValue<T>(value, breakpoints, v => (isEnumValue(v) ? v : undefined));
}
