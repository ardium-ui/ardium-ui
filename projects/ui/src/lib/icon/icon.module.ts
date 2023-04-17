import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconComponent } from './icon.component';
import { ArdiumIconPipe } from './icon.pipe';



@NgModule({
    declarations: [
        ArdiumIconComponent,
        ArdiumIconPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumIconComponent,
        ArdiumIconPipe
    ]
})
export class ArdiumIconModule { }
