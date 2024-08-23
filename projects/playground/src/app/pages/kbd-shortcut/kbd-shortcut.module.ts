import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumKbdShortcutModule } from '@ardium-ui/ui';
import { KbdShortcutPage } from './kbd-shortcut.page';

@NgModule({
  declarations: [KbdShortcutPage],
  imports: [CommonModule, ArdiumKbdShortcutModule],
})
export class KbdShortcutModule {}
