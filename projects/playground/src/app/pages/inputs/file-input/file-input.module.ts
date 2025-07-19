import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumFileInputModule } from 'projects/ui/src/public-api';
import { FileInputPage } from './file-input.page';

@NgModule({
  declarations: [FileInputPage],
  imports: [CommonModule, ArdiumFileInputModule],
})
export class FileInputModule {}
