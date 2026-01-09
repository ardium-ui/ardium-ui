import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumButtonComponent } from './button.component';
import { ArdiumButtonDirective } from './button.directive';

@NgModule({
  declarations: [ArdiumButtonComponent, ArdiumButtonDirective],
  imports: [CommonModule],
  exports: [ArdiumButtonComponent, ArdiumButtonDirective],
})
export class ArdiumButtonModule {}
