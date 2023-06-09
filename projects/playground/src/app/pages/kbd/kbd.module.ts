import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KbdPage } from './kbd.page';
import { ArdiumKbdModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        KbdPage
    ],
    imports: [
        CommonModule,
        ArdiumKbdModule,
    ]
})
export class KbdModule { }
