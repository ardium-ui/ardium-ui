import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-tabber',
  templateUrl: './tabber.page.html',
  styleUrl: './tabber.page.scss',
})
export class TabberPage implements OnDestroy {
  private readonly _logger = inject(Logger);
  public log = this._logger.log;

  readonly selectedTab = signal<string | null>(null);

  private _interval = setInterval(() => {
    this.selectedTab.set(this.selectedTab() === 'tab2' ? 'tab3' : this.selectedTab() === 'tab3' ? 'tab1' : 'tab2');
  }, 2000);
  
  ngOnDestroy(): void {
    clearInterval(this._interval);
  }
}
