import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumKbdShortcutModule } from 'projects/ui/src/public-api';
import { KbdShortcutPage } from './kbd-shortcut.page';

@NgModule({
  declarations: [KbdShortcutPage],
  imports: [CommonModule, ArdiumKbdShortcutModule],
})
export class KbdShortcutModule {}
