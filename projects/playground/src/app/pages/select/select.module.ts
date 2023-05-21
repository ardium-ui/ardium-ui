import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPage } from './select.page';
import { ArdiumOptionModule, ArdiumSelectModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        SelectPage
    ],
    imports: [
        CommonModule,
        ArdiumSelectModule,
        ArdiumOptionModule,
    ]
})
export class SelectModule { }
