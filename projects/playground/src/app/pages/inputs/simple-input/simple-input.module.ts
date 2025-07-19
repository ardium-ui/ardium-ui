import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumIconModule, ArdiumSimpleInputModule } from 'projects/ui/src/public-api';
import { SimpleInputPage } from './simple-input.page';

@NgModule({
  declarations: [SimpleInputPage],
  imports: [CommonModule, ArdiumSimpleInputModule, FormsModule, ArdiumIconModule],
})
export class SimpleInputModule {}
