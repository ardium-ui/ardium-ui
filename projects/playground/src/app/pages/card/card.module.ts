import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPage } from './card.page';
import { ArdiumCardModule, ArdiumButtonModule, ArdiumFabModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [CardPage],
  imports: [CommonModule, ArdiumCardModule, ArdiumButtonModule, ArdiumFabModule],
})
export class CardModule {}
