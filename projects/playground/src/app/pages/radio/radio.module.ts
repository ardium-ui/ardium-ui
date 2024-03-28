import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioPage } from './radio.page';
import { ArdiumRadioModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [RadioPage],
  imports: [CommonModule, ArdiumRadioModule],
})
export class RadioModule {}
