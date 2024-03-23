import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumChipComponent } from './chip.component';
import { ArdiumSelectableChipComponent } from './selectable-chip/selectable-chip.component';
import { ArdiumDeletableChipComponent } from './deletable-chip/deletable-chip.component';
import { _ClearButtonModule } from '../_internal/clear-button/clear-button.module';

@NgModule({
    declarations: [
        ArdiumChipComponent,
        ArdiumSelectableChipComponent,
        ArdiumDeletableChipComponent,
    ],
    imports: [CommonModule, _ClearButtonModule],
    exports: [
        ArdiumChipComponent,
        ArdiumSelectableChipComponent,
        ArdiumDeletableChipComponent,
    ],
})
export class ArdiumChipModule {}
