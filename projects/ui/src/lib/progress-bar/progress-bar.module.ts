import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumProgressBarComponent } from './progress-bar.component';
import { ArdProgressBarValueTemplateDirective } from './progress-bar.directive';

@NgModule({
    declarations: [
        ArdiumProgressBarComponent,
        ArdProgressBarValueTemplateDirective,
    ],
    imports: [CommonModule],
    exports: [ArdiumProgressBarComponent, ArdProgressBarValueTemplateDirective],
})
export class ArdiumProgressBarModule {}
