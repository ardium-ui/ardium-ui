import { Component, effect, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { SliderTooltipFormatFn } from 'projects/ui/src/public-api';
import { Logger } from '../../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage {
  constructor(private _logger: Logger) {}
  log = this._logger.log;

  readonly tooltipFormatFn: SliderTooltipFormatFn = (v: number): string => String(v / 1000) + 'k';

  readonly formControl = new FormControl(50);

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((v) => {
      this.log('FormControl valueChanges:', v);
    });
  }

  readonly testValueObject = signal<{ slider: number, textbox: string }>({ slider: 25, textbox: 'Foo' });

  fkdjf = effect(() => {
    console.log('Signal Form Value:', this.testValueObject());
  })

  readonly signalForm = form(this.testValueObject);
}
