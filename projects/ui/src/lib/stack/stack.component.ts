import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ArdiumBreakpointService } from '../breakpoints/breakpoint.service';
import { parseCSSUnitOrBreakpointConfig, parseEnumOrBreakpointConfig } from '../breakpoints/breakpoint.utils';
import { ArdBreakpointsConfig } from '../breakpoints/breakpoints';
import {
  ArdGridAlign,
  ArdGridDirection,
  ArdGridJustify,
  ArdGridWrap,
  isArdGridAlign,
  isArdGridDirection,
  isArdGridJustify,
  isArdGridWrap,
} from '../grid';
import { ARD_STACK_DEFAULTS } from './stack.defaults';

@Component({
  selector: 'ard-stack',
  standalone: false,
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ard-stack',
    '[style]': 'currentStyle()',
  },
})
export class ArdiumStackComponent {
  protected readonly _DEFAULTS = inject(ARD_STACK_DEFAULTS);

  private readonly _breakpointService = inject(ArdiumBreakpointService);

  //! configurations
  readonly direction = input<
    Required<ArdBreakpointsConfig<ArdGridDirection>>,
    ArdGridDirection | string | ArdBreakpointsConfig<ArdGridDirection>
  >(parseEnumOrBreakpointConfig(this._DEFAULTS.direction, this._breakpointService.breakpoints, isArdGridDirection), {
    transform: value => parseEnumOrBreakpointConfig(value, this._breakpointService.breakpoints, isArdGridDirection),
  });

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

  //! computed properties
  readonly finalColumnSpacing = computed(() => this.columnSpacing() ?? this.spacing());
  readonly finalRowSpacing = computed(() => this.rowSpacing() ?? this.spacing());

  //! current values
  readonly currentDirection = computed(() => this.direction()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentJustifyContent = computed(() => this.justifyContent()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentAlignItems = computed(() => this.alignItems()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentColumnSpacing = computed(() => this.finalColumnSpacing()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentRowSpacing = computed(() => this.finalRowSpacing()[this._breakpointService.currentBreakpoint() ?? 'xs']);
  readonly currentWrap = computed(() => this.wrap()[this._breakpointService.currentBreakpoint() ?? 'xs']);

  readonly currentStyle = computed(() =>
    [
      `--ard-_stack-direction: ${this.currentDirection()}`,
      `--ard-_stack-justify-content: ${this.currentJustifyContent()}`,
      `--ard-_stack-align-items: ${this.currentAlignItems()}`,
      `--ard-_stack-column-spacing: ${this.currentColumnSpacing()}`,
      `--ard-_stack-row-spacing: ${this.currentRowSpacing()}`,
      `--ard-_stack-wrap: ${this.currentWrap()}`,
    ]
      .filter(Boolean)
      .join(';')
  );
}
