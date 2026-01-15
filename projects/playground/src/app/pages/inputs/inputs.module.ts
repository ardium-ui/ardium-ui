import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { ColorInputModule } from './color-input/color-input.module';
import { HexInputModule } from './hex-input/hex-input.module';

import { AutocompleteInputModule } from './autocomplete-input/autocomplete-input.module';
import { DateInputModule } from './date-input/date-input.module';
import { DateRangeInputModule } from './date-range-input/date-range-input.module';
import { DigitInputModule } from './digit-input/digit-input.module';
import { InputModule } from './input/input.module';
import { InputsHomeModule } from './inputs-home/inputs-home.module';
import { InputsRoutingModule } from './inputs-routing.module';
import { InputsPage } from './inputs.page';
import { MultipageDateRangeInputModule } from './multipage-date-range-input/multipage-date-range-input.module';
import { NumberInputModule } from './number-input/number-input.module';
import { PasswordInputModule } from './password-input/password-input.module';

@NgModule({
  declarations: [InputsPage],
  imports: [
    CommonModule,
    InputsRoutingModule,
    InputsHomeModule,
    InputModule,
    AutocompleteInputModule,
    NumberInputModule,
    HexInputModule,
    // ColorInputModule,
    PasswordInputModule,
    DigitInputModule,
    DateInputModule,
    DateRangeInputModule,
    MultipageDateRangeInputModule,
  ],
  exports: [InputsPage],
})
export class InputsModule {}
