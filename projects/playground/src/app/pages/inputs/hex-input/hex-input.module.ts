import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumHexInputModule, ArdiumIconModule } from '@ardium-ui/ui';
import { HexInputPage } from './hex-input.page';

@NgModule({
  declarations: [HexInputPage],
  imports: [CommonModule, FormsModule, ArdiumHexInputModule, ArdiumIconModule],
})
export class HexInputModule {}
