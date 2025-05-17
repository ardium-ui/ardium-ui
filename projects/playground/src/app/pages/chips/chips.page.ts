import { Component } from '@angular/core';
import { ComponentColor, DecorationElementAppearance, FormElementVariant, SimpleOneAxisAlignment } from 'projects/ui/src/public-api';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.page.html',
  styleUrls: ['./chips.page.scss'],
})
export class ChipsPage {
  variants: FormElementVariant[] = Object.values(FormElementVariant);
  appearances: DecorationElementAppearance[] = Object.values(DecorationElementAppearance);
  colors: ComponentColor[] = Object.values(ComponentColor);
  alignments: SimpleOneAxisAlignment[] = Object.values(SimpleOneAxisAlignment);

  constructor(private _logger: Logger) {}
  log = this._logger.log;
}
