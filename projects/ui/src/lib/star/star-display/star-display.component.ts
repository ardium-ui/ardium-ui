import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { isArray } from 'simple-bool';
import { StarColor, StarFillMode } from './../star.types';

@Component({
    selector: 'ard-star-display',
    templateUrl: './star-display.component.html',
    styleUrls: ['./star-display.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumStarDisplayComponent implements OnChanges {
    @Input() wrapperClasses: string = '';

    //* appearance
    @Input() color: StarColor = StarColor.Star;

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
        ].join(' ');
    }

    //* stars
    starArray: StarFillMode[] = this.setStarArrayFromNumber(0);
    @Input() max: number = 5;
    @Input() value: number | StarFillMode[] = 0;

    setStarArrayFromArray(starArr: StarFillMode[]): void {
        this.starArray = [...starArr];
        while (this.starArray.length < this.max) {
            this.starArray.push('none');
        }
    }
    setStarArrayFromNumber(stars: number): StarFillMode[] {
        this.starArray = [];
        while (this.starArray.length < this.max) {
            if (stars >= 1) {
                this.starArray.push('filled');
            }
            else if (Math.round(stars) == 1) {
                this.starArray.push('half');
            }
            else {
                this.starArray.push('none');
            }
            stars--;
        }
        return this.starArray;
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['max'] || changes['value']) {
            if (isArray(this.value)) {
                this.setStarArrayFromArray(this.value);
            }
            else this.setStarArrayFromNumber(this.value);
        }
    }
}