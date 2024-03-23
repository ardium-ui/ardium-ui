import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumProgressCircleComponent } from './progress-circle.component';
import { ArdProgressCircleValueTemplateDirective } from './progress-circle.directive';

@NgModule({
    declarations: [
        ArdiumProgressCircleComponent,
        ArdProgressCircleValueTemplateDirective,
    ],
    imports: [CommonModule],
    exports: [
        ArdiumProgressCircleComponent,
        ArdProgressCircleValueTemplateDirective,
    ],
})
export class ArdiumProgressCircleModule {}
