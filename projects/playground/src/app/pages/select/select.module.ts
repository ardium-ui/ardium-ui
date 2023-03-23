import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPage } from './select.page';
import { ArdiumSelectModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        SelectPage
    ],
    imports: [
        CommonModule,
        ArdiumSelectModule,
    ]
})
export class SelectModule { }
