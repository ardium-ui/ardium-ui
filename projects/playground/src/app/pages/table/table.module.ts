import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ArdiumButtonModule,
  ArdiumTableFromCsvModule,
  ArdiumTableModule,
  ArdiumTablePaginationModule,
} from 'projects/ui/src/public-api';
import { TablePage } from './table.page';

@NgModule({
  declarations: [TablePage],
  imports: [CommonModule, ArdiumTableModule, ArdiumTableFromCsvModule, ArdiumTablePaginationModule, ArdiumButtonModule],
})
export class TableModule {}
