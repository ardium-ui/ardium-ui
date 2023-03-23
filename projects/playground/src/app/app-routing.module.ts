import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPage } from './pages/button/button.page';
import { CheckboxPage } from './pages/checkbox/checkbox.page';
import { ChipsPage } from './pages/chips/chips.page';
import { FabPage } from './pages/fab/fab.page';
import { HomePage } from './pages/home/home.page';
import { InputsPage } from './pages/inputs/inputs.page';
import { SelectPage } from './pages/select/select.page';
import { SlideTogglePage } from './pages/slide-toggle/slide-toggle.page';
import { SliderPage } from './pages/slider/slider.page';
import { StarsPage } from './pages/stars/stars.page';
import { StateboxPage } from './pages/statebox/statebox.page';

const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'select', component: SelectPage },
    { path: 'button', component: ButtonPage },
    { path: 'fab', component: FabPage },
    { path: 'checkbox', component: CheckboxPage },
    { path: 'statebox', component: StateboxPage },
    { path: 'slide-toggle', component: SlideTogglePage },
    { path: 'stars', component: StarsPage },
    { path: 'slider', component: SliderPage },
    { path: 'chips', component: ChipsPage },
    { path: 'inputs', component: InputsPage, loadChildren: () => import('./pages/inputs/inputs.module').then(m => m.InputsModule) },
    //redirects
    { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
