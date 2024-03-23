import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumKbdShortcutComponent } from './kbd-shortcut.component';
import { ArdiumKbdModule } from '../kbd/kbd.module';

@NgModule({
    declarations: [ArdiumKbdShortcutComponent],
    imports: [CommonModule, ArdiumKbdModule],
    exports: [ArdiumKbdShortcutComponent],
})
export class ArdiumKbdShortcutModule {}
