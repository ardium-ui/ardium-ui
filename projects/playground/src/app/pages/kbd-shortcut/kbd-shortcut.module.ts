import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KbdShortcutPage } from './kbd-shortcut.page';
import { ArdiumKbdShortcutModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [KbdShortcutPage],
  imports: [CommonModule, ArdiumKbdShortcutModule],
})
export class KbdShortcutModule {}
