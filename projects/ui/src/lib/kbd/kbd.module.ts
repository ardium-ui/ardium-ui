import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumKbdComponent } from './kbd.component';
import { KbdDirective } from './kbd.directive';
import { ArdiumKbdPipe } from './kbd.pipe';

@NgModule({
  declarations: [ArdiumKbdComponent, ArdiumKbdPipe],
  imports: [CommonModule, KbdDirective],
  exports: [ArdiumKbdComponent, ArdiumKbdPipe, KbdDirective],
})
export class ArdiumKbdModule {}
