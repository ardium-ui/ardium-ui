import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumKbdModule } from '../kbd/kbd.module';
import { ArdiumKbdShortcutComponent } from './kbd-shortcut.component';

@NgModule({
  declarations: [ArdiumKbdShortcutComponent],
  imports: [CommonModule, ArdiumKbdModule],
  exports: [ArdiumKbdShortcutComponent],
})
export class ArdiumKbdShortcutModule {}
