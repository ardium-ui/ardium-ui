import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumStarButtonComponent } from './star-button.component';
import { ArdiumStarModule } from '../star.module';



@NgModule({
    declarations: [
        ArdiumStarButtonComponent
    ],
    imports: [
        CommonModule,
        ArdiumStarModule,
    ],
    exports: [
        ArdiumStarButtonComponent
    ],
})
export class ArdiumStarButtonModule { }
