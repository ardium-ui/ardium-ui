import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxPage } from './checkbox.page';
import { ArdiumCheckboxModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CheckboxPage],
  imports: [CommonModule, ArdiumCheckboxModule, FormsModule],
})
export class CheckboxModule {}
