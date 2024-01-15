import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrl: './modal.page.scss'
})
export class ModalPage {
    readonly isOpen1 = signal(false);
    readonly isOpen2 = signal(false);
}
