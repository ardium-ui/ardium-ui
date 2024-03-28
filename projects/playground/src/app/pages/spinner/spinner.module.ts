import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerPage } from './spinner.page';
import { ArdiumSpinnerModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [SpinnerPage],
  imports: [CommonModule, ArdiumSpinnerModule],
})
export class SpinnerModule {}
