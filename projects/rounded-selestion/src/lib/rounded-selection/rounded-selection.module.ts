import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoundedSelectionDirective } from './rounded-selection.directive';


@NgModule({
    declarations: [
        RoundedSelectionDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        RoundedSelectionDirective
    ]
})
export class RoundedSelectionModule { }
