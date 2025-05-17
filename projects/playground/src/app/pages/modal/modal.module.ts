import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumModalModule, ArdiumSelectModule, ArdiumSlideToggleModule } from 'projects/ui/src/public-api';
import { ModalPage } from './modal.page';

@NgModule({
  declarations: [ModalPage],
  imports: [CommonModule, ArdiumModalModule, ArdiumSelectModule, ArdiumSlideToggleModule],
})
export class ModalModule {}
