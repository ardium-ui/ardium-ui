import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArdiumClickOutsideModule } from '@ardium-ui/devkit';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';

import { ArdiumIconButtonModule } from '../../buttons/icon-button';
import { ArdiumCalendarModule } from '../../calendar';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumIconModule } from '../../icon';
import { ArdiumDateInputComponent } from './date-input.component';

@NgModule({
  declarations: [
    ArdiumDateInputComponent,
    //template directives
  ],
  imports: [
    CommonModule,
    ArdiumFormFieldFrameModule,
    ArdiumDropdownPanelModule,
    ArdiumClickOutsideModule,
    ArdiumCalendarModule,
    ArdiumIconButtonModule,
    ArdiumIconModule,
  ],
  exports: [
    ArdiumDateInputComponent,
    //tempalate directives
  ],
})
export class ArdiumDateInputModule {}
