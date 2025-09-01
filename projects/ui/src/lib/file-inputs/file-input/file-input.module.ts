import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumIconModule } from '../../icon/icon.module';
import { ArdiumFileInputComponent } from './file-input.component';
import {
  ArdFileInputPlaceholderTemplateDirective,
  ArdFileInputPrefixTemplateDirective,
  ArdFileInputSuffixTemplateDirective,
  ArdiumFileInputDragoverContentTemplateDirective,
  ArdiumFileInputFolderIconTemplateDirective,
  ArdiumFileInputIdleContentTemplateDirective,
  ArdiumFileInputUploadedContentTemplateDirective,
} from './file-input.directives';

@NgModule({
  declarations: [
    ArdiumFileInputComponent,
    ArdiumFileInputFolderIconTemplateDirective,
    ArdiumFileInputUploadedContentTemplateDirective,
    ArdiumFileInputDragoverContentTemplateDirective,
    ArdiumFileInputIdleContentTemplateDirective,
    ArdFileInputSuffixTemplateDirective,
    ArdFileInputPrefixTemplateDirective,
    ArdFileInputPlaceholderTemplateDirective,
  ],
  imports: [CommonModule, ArdiumFormFieldFrameModule, _ClearButtonModule, ArdiumIconModule],
  exports: [
    ArdiumFileInputComponent,
    ArdiumFileInputFolderIconTemplateDirective,
    ArdiumFileInputUploadedContentTemplateDirective,
    ArdiumFileInputDragoverContentTemplateDirective,
    ArdiumFileInputIdleContentTemplateDirective,
    ArdFileInputSuffixTemplateDirective,
    ArdFileInputPrefixTemplateDirective,
    ArdFileInputPlaceholderTemplateDirective,
  ],
})
export class ArdiumFileInputModule {}
