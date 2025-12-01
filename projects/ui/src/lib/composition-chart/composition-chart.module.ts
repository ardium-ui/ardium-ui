import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompositionChartComponent } from './composition-chart.component';



@NgModule({
  declarations: [
    CompositionChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CompositionChartComponent
  ]
})
export class CompositionChartModule { }
