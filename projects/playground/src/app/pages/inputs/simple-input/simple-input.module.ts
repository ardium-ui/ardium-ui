import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumIconModule, ArdiumSimpleInputModule } from '@ardium-ui/ui';
import { SimpleInputPage } from './simple-input.page';

@NgModule({
  declarations: [SimpleInputPage],
  imports: [CommonModule, ArdiumSimpleInputModule, FormsModule, ArdiumIconModule],
})
export class SimpleInputModule {}
