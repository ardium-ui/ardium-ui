import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleInputPage } from './simple-input.page';
import { ArdiumFormFieldFrameModule, ArdiumIconModule, ArdiumSimpleInputModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SimpleInputPage],
  imports: [CommonModule, ArdiumSimpleInputModule, FormsModule, ArdiumIconModule],
})
export class SimpleInputModule {}
