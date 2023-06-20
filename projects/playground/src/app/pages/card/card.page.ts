import { Component, ViewEncapsulation } from '@angular/core';
import { OneAxisAlignment } from '@ardium-ui/ui';

@Component({
    selector: 'app-card',
    templateUrl: './card.page.html',
    styleUrls: ['./card.page.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CardPage {
    bearText = 'The brown bear is a large bear living in much of northern Eurasia and North America. It is smaller than the polar bear, but is the largest carnivore which lives entirely on the land. There are several recognized subspecies.'

    aligns: OneAxisAlignment[] = Object.values(OneAxisAlignment);

    likesBear: boolean = false;
}
