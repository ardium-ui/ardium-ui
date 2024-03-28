import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ArdiumCardActionButtonsDirective,
  ArdiumCardAvatarDirective,
  ArdiumCardContentDirective,
  ArdiumCardFooterDirective,
  ArdiumCardHeaderComponent,
  ArdiumCardImageDirective,
  ArdiumCardSubtitleDirective,
  ArdiumCardTitleDirective,
} from './card.children';
import { ArdiumCardComponent, ArdiumCardDirective } from './card.component';

@NgModule({
  declarations: [
    ArdiumCardComponent,
    ArdiumCardDirective,
    ArdiumCardHeaderComponent,
    ArdiumCardTitleDirective,
    ArdiumCardSubtitleDirective,
    ArdiumCardAvatarDirective,
    ArdiumCardContentDirective,
    ArdiumCardImageDirective,
    ArdiumCardActionButtonsDirective,
    ArdiumCardFooterDirective,
  ],
  imports: [CommonModule],
  exports: [
    ArdiumCardComponent,
    ArdiumCardDirective,
    ArdiumCardHeaderComponent,
    ArdiumCardTitleDirective,
    ArdiumCardSubtitleDirective,
    ArdiumCardAvatarDirective,
    ArdiumCardContentDirective,
    ArdiumCardImageDirective,
    ArdiumCardActionButtonsDirective,
    ArdiumCardFooterDirective,
  ],
})
export class ArdiumCardModule {}
