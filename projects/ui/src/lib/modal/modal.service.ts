import { ComponentRef, Injectable, Type } from '@angular/core';
import { OverlayService } from './../overlay/overlay.service';
import { ArdModalRef } from './modal-ref';
import { ArdiumModalComponent } from './modal.component';

@Injectable({
    providedIn: 'root'
})
export class ArdiumModalService {

    constructor(
        private _overlayService: OverlayService,
    ) { }

    open(component: Type<any>, modalProperties?: ArdiumModalComponent): ArdModalRef {
        let modalComponentRef: ComponentRef<ArdiumModalComponent> = this._overlayService.appendOverlayComponent(ArdiumModalComponent);

        if (modalProperties) {
            let property: keyof ArdiumModalComponent;
            for (property in modalProperties) {
                const value = modalProperties[property];
                (modalComponentRef.instance[property] as typeof value) = value;
            }
        }
        modalComponentRef.instance.component = component;

        return new ArdModalRef(modalComponentRef);
    }
}
