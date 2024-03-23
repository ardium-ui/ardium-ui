import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumModalComponent } from './modal.component';
import { ArdiumIconButtonModule } from '../buttons/icon-button/icon-button.module';
import { ArdiumIconModule } from '../icon/icon.module';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [ArdiumModalComponent],
    imports: [CommonModule, ArdiumIconButtonModule, ArdiumIconModule, A11yModule],
    exports: [ArdiumModalComponent],
})
export class ArdiumModalModule {}
