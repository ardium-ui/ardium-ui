import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ButtonModule } from './pages/button/button.module';
import { CheckboxModule } from './pages/checkbox/checkbox.module';
import { ChipsModule } from './pages/chips/chips.module';
import { FabModule } from './pages/fab/fab.module';
import { HomeModule } from './pages/home/home.module';
import { InputsModule } from './pages/inputs/inputs.module';
import { SegmentModule } from './pages/segment/segment.module';
import { SelectModule } from './pages/select/select.module';
import { SlideToggleModule } from './pages/slide-toggle/slide-toggle.module';
import { SliderModule } from './pages/slider/slider.module';
import { StarsModule } from './pages/stars/stars.module';
import { StateboxModule } from './pages/statebox/statebox.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomeModule,
        SelectModule,
        ButtonModule,
        FabModule,
        CheckboxModule,
        SlideToggleModule,
        StarsModule,
        StateboxModule,
        SliderModule,
        ChipsModule,
        InputsModule,
        SegmentModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
