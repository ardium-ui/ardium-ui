import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColorInputModule } from './color-input/color-input.module';
import { HexInputModule } from './hex-input/hex-input.module';
import { InputModule } from './input/input.module';

import { InputsHomeModule } from './inputs-home/inputs-home.module';
import { InputsRoutingModule } from './inputs-routing.module';
import { InputsPage } from './inputs.page';
import { NumberInputModule } from './number-input/number-input.module';
import { PasswordInputModule } from './password-input/password-input.module';
import { SimpleInputModule } from './simple-input/simple-input.module';
import { DigitInputModule } from './digit-input/digit-input.module';

@NgModule({
  declarations: [InputsPage],
  imports: [
    CommonModule,
    InputsRoutingModule,
    InputsHomeModule,
    SimpleInputModule,
    InputModule,
    NumberInputModule,
    HexInputModule,
    ColorInputModule,
    PasswordInputModule,
    DigitInputModule,
  ],
  exports: [InputsPage],
})
export class InputsModule {}
