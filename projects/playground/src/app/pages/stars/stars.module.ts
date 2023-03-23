import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsPage } from './stars.page';
import { ArdiumStarButtonModule, ArdiumStarDisplayModule, ArdiumStarInputModule, ArdiumStarModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        StarsPage
    ],
    imports: [
        CommonModule,
        ArdiumStarModule,
        ArdiumStarButtonModule,
        ArdiumStarDisplayModule,
        ArdiumStarInputModule,
    ]
})
export class StarsModule { }
