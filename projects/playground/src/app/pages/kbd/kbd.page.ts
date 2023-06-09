import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-kbd',
  templateUrl: './kbd.page.html',
  styleUrls: ['./kbd.page.scss']
})
export class KbdPage implements OnInit, OnDestroy {

    readonly keys: string[] = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];
    currentKeyIndex: number = 0;

    get currentKey(): string {
        return this.keys[this.currentKeyIndex];
    }

    private _interval?: NodeJS.Timeout;
    ngOnInit(): void {
        this._interval = setInterval(() => {
            if (this.currentKeyIndex == this.keys.length - 1)
                this.currentKeyIndex = 0;
            else
                this.currentKeyIndex++;
        }, 1000);
    }
    ngOnDestroy(): void {
        if (!this._interval) return;

        clearInterval(this._interval);
    }
}
