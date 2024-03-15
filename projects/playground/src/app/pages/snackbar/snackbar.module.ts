import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarPage } from './snackbar.page';
import { ArdiumButtonModule, ArdiumSnackbarService } from '@ardium-ui/ui';

@NgModule({
    declarations: [SnackbarPage],
    imports: [CommonModule, ArdiumButtonModule],
    providers: [ArdiumSnackbarService],
})
export class SnackbarModule {
    
}
