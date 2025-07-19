import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumDialogModule, ArdiumSelectModule, ArdiumSlideToggleModule } from 'projects/ui/src/public-api';
import { DialogPage } from './dialog.page';

@NgModule({
  declarations: [DialogPage],
  imports: [CommonModule, ArdiumDialogModule, ArdiumSelectModule, ArdiumSlideToggleModule],
})
export class DialogModule {}
