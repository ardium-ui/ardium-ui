import { AfterContentChecked, ChangeDetectionStrategy, Component, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { ArdiumTabComponent } from './tab/tab.component';

@Component({
  selector: 'ard-tabber',
  templateUrl: './tabber.component.html',
  styleUrl: './tabber.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTabberComponent implements AfterContentChecked {
  @ContentChildren(ArdiumTabComponent, { descendants: true })
  private _tabs!: QueryList<ArdiumTabComponent>;

  ngAfterContentChecked(): void {
    console.log(this._tabs);
  }
}
