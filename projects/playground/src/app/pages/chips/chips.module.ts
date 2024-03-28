import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsPage } from './chips.page';
import { ArdiumChipModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [ChipsPage],
  imports: [CommonModule, ArdiumChipModule],
})
export class ChipsModule {}
