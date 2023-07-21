import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropAreaPage } from './file-drop-area.page';
import { ArdiumFileDropAreaModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        FileDropAreaPage
    ],
    imports: [
        CommonModule,
        ArdiumFileDropAreaModule,
    ]
})
export class FileDropAreaModule { }
