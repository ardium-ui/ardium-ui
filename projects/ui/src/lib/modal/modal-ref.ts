import { ComponentRef } from "@angular/core";
import { ArdiumModalComponent } from './modal.component';


export class ArdModalRef {
    readonly componentRef!: ComponentRef<ArdiumModalComponent>

    constructor(componentRef: ComponentRef<ArdiumModalComponent>) {
        this.componentRef = componentRef;

        let subscription = componentRef.instance.closeEvent.subscribe(() => {
            this.close();
            subscription.unsubscribe();
        })
    }

    close() {
        this.componentRef.destroy();
    }
}