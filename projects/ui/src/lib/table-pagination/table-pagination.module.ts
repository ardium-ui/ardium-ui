import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconButtonModule } from '../buttons/icon-button/icon-button.module';
import { ArdiumSelectModule } from '../select/select.module';
import { ArdiumTablePaginationComponent } from './table-pagination.component';
import { ArdiumIconModule } from '../icon/icon.module';

@NgModule({
    declarations: [ArdiumTablePaginationComponent],
    imports: [
        CommonModule,
        ArdiumSelectModule,
        ArdiumIconButtonModule,
        ArdiumIconModule,
    ],
    exports: [ArdiumTablePaginationComponent],
})
export class ArdiumTablePaginationModule {}
