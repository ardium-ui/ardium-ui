import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorInputPage } from './color-input/color-input.page';
import { FileInputPage } from './file-input/file-input.page';
import { HexInputPage } from './hex-input/hex-input.page';
import { InputPage } from './input/input.page';
import { InputsHomePage } from './inputs-home/inputs-home.page';
import { NumberInputPage } from './number-input/number-input.page';
import { PasswordInputPage } from './password-input/password-input.page';
import { SimpleInputPage } from './simple-input/simple-input.page';

const routes: Routes = [
    { path: '', component: InputsHomePage },
    { path: 'simple-input', component: SimpleInputPage },
    { path: 'input', component: InputPage },
    { path: 'number-input', component: NumberInputPage },
    { path: 'hex-input', component: HexInputPage },
    { path: 'color-input', component: ColorInputPage },
    { path: 'password-input', component: PasswordInputPage },
    { path: 'file-input', component: FileInputPage },
    //redirects
    { path: '**' , redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputsRoutingModule { }
