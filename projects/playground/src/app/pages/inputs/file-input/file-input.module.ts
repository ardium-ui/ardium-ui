import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumFileInputModule, ArdiumFormFieldModule } from 'projects/ui/src/public-api';
import { FileInputPage } from './file-input.page';

@NgModule({
  declarations: [FileInputPage],
  imports: [CommonModule, ArdiumFileInputModule, ReactiveFormsModule, ArdiumFormFieldModule],
})
export class FileInputModule {}
