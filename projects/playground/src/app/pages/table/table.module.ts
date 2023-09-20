import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePage } from './table.page';
import { ArdiumTableModule, ArdiumTableFromCsvModule, ArdiumTablePaginationModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        TablePage
    ],
    imports: [
        CommonModule,
        ArdiumTableModule,
        ArdiumTableFromCsvModule,
        ArdiumTablePaginationModule,
    ]
})
export class TableModule { }
