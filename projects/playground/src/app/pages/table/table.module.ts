import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePage } from './table.page';
import { ArdiumTableModule, ArdiumTableFromCsvModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        TablePage
    ],
    imports: [
        CommonModule,
        ArdiumTableModule,
        ArdiumTableFromCsvModule,
    ]
})
export class TableModule { }
