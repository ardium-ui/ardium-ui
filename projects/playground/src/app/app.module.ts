import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ButtonModule } from './pages/button/button.module';
import { CalendarModule } from './pages/calendar/calendar.module';
import { CardModule } from './pages/card/card.module';
import { CheckboxModule } from './pages/checkbox/checkbox.module';
import { ChipsModule } from './pages/chips/chips.module';
import { FabModule } from './pages/fab/fab.module';
import { HomeModule } from './pages/home/home.module';
import { IconModule } from './pages/icon/icon.module';
import { InputsModule } from './pages/inputs/inputs.module';
import { SegmentModule } from './pages/segment/segment.module';
import { SelectModule } from './pages/select/select.module';
import { SlideToggleModule } from './pages/slide-toggle/slide-toggle.module';
import { SlidersModule } from './pages/sliders/sliders.module';
import { StarsModule } from './pages/stars/stars.module';
import { StateboxModule } from './pages/statebox/statebox.module';
import { ColorDisplayModule } from './pages/color-display/color-display.module';
import { ColorPickerModule } from './pages/color-picker/color-picker.module';
import { ProgressCircleModule } from './pages/progress-circle/progress-circle.module';
import { KbdModule } from './pages/kbd/kbd.module';
import { KbdShortcutModule } from './pages/kbd-shortcut/kbd-shortcut.module';

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
        ChipsModule,
        InputsModule,
        SegmentModule,
        SlidersModule,
        IconModule,
        ColorDisplayModule,
        ColorPickerModule,
        CalendarModule,
        ProgressCircleModule,
        KbdModule,
        KbdShortcutModule,
        CardModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
