import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumKbdComponent } from './kbd.component';
import { ArdiumKbdDirective } from './kbd.directive';
import { ArdiumKbdPipe } from './kbd.pipe';

@NgModule({
  declarations: [ArdiumKbdComponent, ArdiumKbdPipe, ArdiumKbdDirective],
  imports: [CommonModule],
  exports: [ArdiumKbdComponent, ArdiumKbdPipe, ArdiumKbdDirective],
})
export class ArdiumKbdModule {}
