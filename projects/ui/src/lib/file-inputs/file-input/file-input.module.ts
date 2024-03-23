import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFileInputComponent } from './file-input.component';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumIconModule } from '../../icon/icon.module';

@NgModule({
    declarations: [ArdiumFileInputComponent],
    imports: [CommonModule, ArdiumFormFieldFrameModule, _ClearButtonModule, ArdiumIconModule],
    exports: [ArdiumFileInputComponent],
})
export class ArdiumFileInputModule {}
