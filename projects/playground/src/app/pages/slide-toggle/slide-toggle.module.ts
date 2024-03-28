import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideTogglePage } from './slide-toggle.page';
import { ArdiumSlideToggleModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SlideTogglePage],
  imports: [CommonModule, ArdiumSlideToggleModule, FormsModule],
})
export class SlideToggleModule {}
