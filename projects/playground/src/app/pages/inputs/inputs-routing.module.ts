import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutocompleteInputPage } from './autocomplete-input/autocomplete-input.page';
import { ColorInputPage } from './color-input/color-input.page';
import { DateInputPage } from './date-input/date-input.page';
import { DateRangeInputPage } from './date-range-input/date-range-input.page';
import { DigitInputPage } from './digit-input/digit-input.page';
import { FileInputPage } from './file-input/file-input.page';
import { HexInputPage } from './hex-input/hex-input.page';
import { InputPage } from './input/input.page';
import { InputsHomePage } from './inputs-home/inputs-home.page';
import { NumberInputPage } from './number-input/number-input.page';
import { PasswordInputPage } from './password-input/password-input.page';

const routes: Routes = [
  { path: '', component: InputsHomePage },
  { path: 'input', component: InputPage },
  { path: 'autocomplete-input', component: AutocompleteInputPage },
  { path: 'number-input', component: NumberInputPage },
  { path: 'hex-input', component: HexInputPage },
  { path: 'color-input', component: ColorInputPage },
  { path: 'password-input', component: PasswordInputPage },
  { path: 'file-input', component: FileInputPage },
  { path: 'digit-input', component: DigitInputPage },
  { path: 'date-input', component: DateInputPage },
  { path: 'date-range-input', component: DateRangeInputPage },
  //redirects
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InputsRoutingModule {}
