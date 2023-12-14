import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSearchBarModule } from '@ardium-ui/ui';
import { SearchBarPage } from './search-bar.page';



@NgModule({
    declarations: [
        SearchBarPage
    ],
    imports: [
        CommonModule,
        ArdiumSearchBarModule,
    ]
})
export class SearchBarModule { }
