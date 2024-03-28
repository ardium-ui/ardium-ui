import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputPage } from './password-input.page';
import { ArdiumPasswordInputModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [PasswordInputPage],
  imports: [CommonModule, ArdiumPasswordInputModule],
})
export class PasswordInputModule {}
