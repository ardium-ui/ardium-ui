import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabPage } from './fab.page';
import { ArdiumFabModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        FabPage
    ],
    imports: [
        CommonModule,
        ArdiumFabModule,
    ]
})
export class FabModule { }
