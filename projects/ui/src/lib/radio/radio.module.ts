import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumRadioGroupComponent } from './radio-group.component';
import { ArdiumRadioComponent } from './radio/radio.component';

@NgModule({
    declarations: [ArdiumRadioGroupComponent, ArdiumRadioComponent],
    imports: [CommonModule],
    exports: [ArdiumRadioGroupComponent, ArdiumRadioComponent],
})
export class ArdiumRadioModule {}
