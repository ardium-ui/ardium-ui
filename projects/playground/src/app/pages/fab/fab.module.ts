import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabPage } from './fab.page';
import { ArdiumCheckboxModule, ArdiumFabModule, ArdiumIconModule, ArdiumSelectModule, ArdiumSimpleInputModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        FabPage
    ],
    imports: [
        CommonModule,
        ArdiumFabModule,
        ArdiumIconModule,
        ArdiumSelectModule,
        ArdiumCheckboxModule,
        ArdiumSimpleInputModule,
    ]
})
export class FabModule { }
