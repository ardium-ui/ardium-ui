import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPage } from './modal.page';
import { ArdiumModalModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        ModalPage
    ],
    imports: [
        CommonModule,
        ArdiumModalModule,
    ]
})
export class ModalModule { }
