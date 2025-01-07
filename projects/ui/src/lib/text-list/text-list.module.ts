import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumTextListComponent } from './text-list.component';
import { ArdiumTextListPipe } from './text-list.pipe';

@NgModule({
  declarations: [ArdiumTextListComponent, ArdiumTextListPipe],
  imports: [CommonModule],
  exports: [ArdiumTextListComponent, ArdiumTextListPipe],
})
export class ArdiumTextListModule {}
