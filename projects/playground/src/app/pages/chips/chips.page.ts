import { Component } from '@angular/core';
import { SimpleOneAxisAlignment, ChipVariant, ComponentColor, DecorationElementAppearance } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.page.html',
  styleUrls: ['./chips.page.scss']
})
export class ChipsPage {
    variants: ChipVariant[] = [ChipVariant.Basic, ChipVariant.Pill];
    appearances: DecorationElementAppearance[] = Object.values(DecorationElementAppearance);
    colors: ComponentColor[] = Object.values(ComponentColor);
    alignments: SimpleOneAxisAlignment[] = Object.values(SimpleOneAxisAlignment);

    constructor(private _logger: Logger) { }
    log = this._logger.log;
}
