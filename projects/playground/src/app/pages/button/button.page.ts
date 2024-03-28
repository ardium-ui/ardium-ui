import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonAppearance as BA, ButtonVariant as BV, ComponentColor as CC, SimpleOneAxisAlignment as SOAA } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.page.html',
  styleUrls: ['./button.page.scss'],
})
export class ButtonPage implements OnInit {
  variants: BV[] = [BV.Rounded, BV.Pill, BV.Sharp];
  aligns: SOAA[] = [SOAA.Left, SOAA.Right];
  appearances: BA[] = Object.values(BA);
  colors: CC[] = Object.values(CC);

  appearance: BA[] = [BA.Raised];
  variant: BV[] = [BV.Rounded];
  color: CC[] = [CC.Primary];
  align: SOAA = SOAA.Left;
  compact: boolean = false;
  vertical: boolean = false;
  disabled: boolean = false;
  icon: string | null = 'favorite';
  text: string | null = 'Text';

  constructor(private _logger: Logger) {}
  log = this._logger.log;

  ngOnInit(): void {}
}
