import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    Renderer2,
    RendererFactory2,
    ViewContainerRef,
    Type,
    Inject,
    ComponentRef,
} from '@angular/core';
import { _OverlayComponent } from './overlay.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class OverlayService {

    private renderer!: Renderer2;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        @Inject(DOCUMENT) public document: Document,
        rendererFactory: RendererFactory2,
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    private _overlayContainer!: ViewContainerRef;
    private _overlayContainerEl!: HTMLElement;

    appendOverlayComponent<T>(component: Type<T>): ComponentRef<T> {
        this._appendContainerDiv();
        let componentRef: ComponentRef<T>;
        if (this._overlayContainer) {
            componentRef = this._overlayContainer.createComponent(component);
        }
        else {
            componentRef = this.appendElementTo(component, this._overlayContainerEl);
        }
        return componentRef;
    }

    appendElementTo<T>(component: Type<T>, element: HTMLElement): ComponentRef<T> {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        this.renderer.appendChild(element, domElem);

        return componentRef;
    }
    private _appendContainerDiv(): void {
        if (this._overlayContainer) return;

        const componentRef = this.appendElementTo(_OverlayComponent, this.document.body);

        this._overlayContainer = componentRef.instance.container;
        this._overlayContainerEl = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    }
}