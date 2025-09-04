import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideModule } from '@ardium-ui/devkit';
import { ArdiumIconButtonModule } from '../../buttons/icon-button';
import { ArdiumCalendarModule } from '../../calendar';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumIconModule } from '../../icon';
import { ArdiumDateInputComponent } from './date-input.component';
import { ArdDateInputAcceptButtonsTemplateDirective, ArdDateInputCalendarIconTemplateDirective, ArdDateInputPrefixTemplateDirective, ArdDateInputSuffixTemplateDirective, ArdDateInputValueTemplateDirective } from './date-input.directive';

@NgModule({
  declarations: [
    ArdiumDateInputComponent,
    //template directives
    ArdDateInputPrefixTemplateDirective,
    ArdDateInputSuffixTemplateDirective,
    ArdDateInputValueTemplateDirective,
    ArdDateInputCalendarIconTemplateDirective,
    ArdDateInputAcceptButtonsTemplateDirective
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
    ArdDateInputPrefixTemplateDirective,
    ArdDateInputSuffixTemplateDirective,
    ArdDateInputValueTemplateDirective,
    ArdDateInputCalendarIconTemplateDirective,
    ArdDateInputAcceptButtonsTemplateDirective
  ],
})
export class ArdiumDateInputModule {}
