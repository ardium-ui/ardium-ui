import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumDialogComponent } from './dialog.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ArdiumModalModule } from '../modal/modal.module';
import { ArdDialogButtonsTemplateDirective } from './dialog.directives';



@NgModule({
    declarations: [ArdiumDialogComponent, ArdDialogButtonsTemplateDirective],
    imports: [
        CommonModule,
        A11yModule,
        ArdiumButtonModule,
        ArdiumModalModule,
    ],
    exports: [ArdiumDialogComponent, ArdDialogButtonsTemplateDirective],
})
export class ArdiumDialogModule {}
