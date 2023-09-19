import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTablePaginationComponent } from './table-pagination.component';



@NgModule({
  declarations: [
    ArdiumTablePaginationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArdiumTablePaginationComponent
  ]
})
export class ArdiumTablePaginationModule { }
