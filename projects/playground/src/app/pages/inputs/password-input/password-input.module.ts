import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumPasswordInputModule } from 'projects/ui/src/public-api';
import { PasswordInputPage } from './password-input.page';

@NgModule({
  declarations: [PasswordInputPage],
  imports: [CommonModule, ArdiumPasswordInputModule],
})
export class PasswordInputModule {}
