import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListPage } from './checkbox-list.page';
import { ArdiumCheckboxListModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        CheckboxListPage
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxListModule,
    ]
})
export class CheckboxListModule { }
