import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputPage } from './file-input.page';
import { ArdiumFileInputModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [FileInputPage],
  imports: [CommonModule, ArdiumFileInputModule],
})
export class FileInputModule {}
