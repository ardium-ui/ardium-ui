import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputPage } from './input/input.page';
import { InputsHomePage } from './inputs-home/inputs-home.page';
import { SimpleInputPage } from './simple-input/simple-input.page';

const routes: Routes = [
    { path: '', component: InputsHomePage },
    { path: 'simple-input', component: SimpleInputPage },
    { path: 'input', component: InputPage },
    //redirects
    { path: '**' , redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputsRoutingModule { }
