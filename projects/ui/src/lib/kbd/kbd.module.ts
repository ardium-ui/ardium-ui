import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumKbdComponent } from './kbd.component';
import { ArdiumKbdPipe } from './kbd.pipe';

@NgModule({
    declarations: [ArdiumKbdComponent, ArdiumKbdPipe],
    imports: [CommonModule],
    exports: [ArdiumKbdComponent, ArdiumKbdPipe],
})
export class ArdiumKbdModule {}
