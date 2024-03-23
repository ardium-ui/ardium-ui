import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumDialogComponent } from './dialog.component';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ArdiumModalModule } from '../modal/modal.module';
import { ArdDialogButtonsTemplateDirective } from './dialog.directives';

@NgModule({
    declarations: [ArdiumDialogComponent, ArdDialogButtonsTemplateDirective],
    imports: [CommonModule, ArdiumButtonModule, ArdiumModalModule],
    exports: [ArdiumDialogComponent, ArdDialogButtonsTemplateDirective],
})
export class ArdiumDialogModule {}
