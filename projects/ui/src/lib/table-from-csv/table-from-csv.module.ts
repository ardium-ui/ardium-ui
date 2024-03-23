import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTableFromCsvComponent } from './table-from-csv.component';
import { ArdiumTableModule } from './../table/table.module';

@NgModule({
    declarations: [ArdiumTableFromCsvComponent],
    imports: [CommonModule, ArdiumTableModule],
    exports: [ArdiumTableFromCsvComponent],
})
export class ArdiumTableFromCsvModule {}
