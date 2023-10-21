import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.page.html',
  styleUrls: ['./progress-bar.page.scss']
})
export class ProgressBarPage implements OnInit {


    currentProgress = -17;
    currentBuffer = -7;

    private _createTimeout(fn: (modif: number) => void) {
        const randomModifier = 200 + Math.random() * 300;
        setTimeout(() => {
            fn(randomModifier);
            this._createTimeout(fn);
        }, randomModifier);
    }

    ngOnInit(): void {
        this._createTimeout(modif => {
            if (this.currentProgress > 100) {
                this.currentProgress = -17;
                this.currentBuffer = -7;
            }
            this.currentProgress += (1000 + Math.random() * 8000) * modif / 1_000_000;
        });
        this._createTimeout(modif => {
            this.currentBuffer += (1000 + Math.random() * 7500) * modif / 1_000_000 * 1.1;
        })
    }
}
