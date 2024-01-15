import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumModalComponent } from './modal.component';
import { ArdiumIconButtonModule } from '../buttons/icon-button/icon-button.module';
import { ArdiumIconModule } from '../icon/icon.module';



@NgModule({
    declarations: [
        ArdiumModalComponent
    ],
    imports: [
        CommonModule,
        ArdiumIconButtonModule,
        ArdiumIconModule,
    ],
    exports: [
        ArdiumModalComponent
    ],
})
export class ArdiumModalModule { }
