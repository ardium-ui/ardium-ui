import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule } from '@ardium-ui/ui';
import { IconPage } from './icon.page';



@NgModule({
    declarations: [
        IconPage
    ],
    imports: [
        CommonModule,
        ArdiumIconModule,
    ],
    exports: [
        IconPage,
    ]
})
export class IconModule { }
