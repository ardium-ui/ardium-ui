import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPage } from './select.page';
import { ArdiumFormFieldFrameModule, ArdiumOptionModule, ArdiumSelectModule, ArdiumIconModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        SelectPage
    ],
    imports: [
        CommonModule,
        ArdiumSelectModule,
        ArdiumOptionModule,
        ArdiumIconModule,
    ]
})
export class SelectModule { }
