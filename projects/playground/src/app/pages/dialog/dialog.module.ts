import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPage } from './dialog.page';
import { ArdiumDialogModule, ArdiumSelectModule, ArdiumSlideToggleModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [DialogPage],
  imports: [CommonModule, ArdiumDialogModule, ArdiumSelectModule, ArdiumSlideToggleModule],
})
export class DialogModule {}
