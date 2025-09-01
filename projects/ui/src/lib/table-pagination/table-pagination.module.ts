import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconButtonModule } from '../buttons/icon-button/icon-button.module';
import { ArdiumIconModule } from '../icon/icon.module';
import { ArdiumSelectModule } from '../select/select.module';
import { ArdiumTablePaginationComponent } from './table-pagination.component';

@NgModule({
  declarations: [ArdiumTablePaginationComponent],
  imports: [CommonModule, ArdiumSelectModule, ArdiumIconButtonModule, ArdiumIconModule],
  exports: [ArdiumTablePaginationComponent],
})
export class ArdiumTablePaginationModule {}
