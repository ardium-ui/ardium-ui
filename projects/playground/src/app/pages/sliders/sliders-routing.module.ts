import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RangeSliderPage } from './range-slider/range-slider.page';
import { SliderPage } from './slider/slider.page';
import { SlidersHomePage } from './sliders-home/sliders-home.page';

const routes: Routes = [
    { path: '', component: SlidersHomePage },
    { path: 'slider', component: SliderPage },
    { path: 'range-slider', component: RangeSliderPage },
    //redirects
    { path: '**' , redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidersRoutingModule { }
