import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumAutocompleteInputModule, ArdiumIconModule } from 'projects/ui/src/public-api';
import { AutocompleteInputPage } from './autocomplete-input.page';

@NgModule({
  declarations: [AutocompleteInputPage],
  imports: [CommonModule, FormsModule, ArdiumAutocompleteInputModule, ArdiumIconModule],
})
export class AutocompleteInputModule {}
