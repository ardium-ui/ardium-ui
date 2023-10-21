import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ButtonModule } from './pages/button/button.module';
import { CalendarModule } from './pages/calendar/calendar.module';
import { CardModule } from './pages/card/card.module';
import { CheckboxModule } from './pages/checkbox/checkbox.module';
import { ChipsModule } from './pages/chips/chips.module';
import { ColorDisplayModule } from './pages/color-display/color-display.module';
import { ColorPickerModule } from './pages/color-picker/color-picker.module';
import { DividerModule } from './pages/divider/divider.module';
import { FabModule } from './pages/fab/fab.module';
import { FileDropAreaModule } from './pages/file-drop-area/file-drop-area.module';
import { HomeModule } from './pages/home/home.module';
import { IconButtonModule } from './pages/icon-button/icon-button.module';
import { IconModule } from './pages/icon/icon.module';
import { FileInputModule } from './pages/inputs/file-input/file-input.module';
import { InputsModule } from './pages/inputs/inputs.module';
import { KbdShortcutModule } from './pages/kbd-shortcut/kbd-shortcut.module';
import { KbdModule } from './pages/kbd/kbd.module';
import { ProgressCircleModule } from './pages/progress-circle/progress-circle.module';
import { RadioModule } from './pages/radio/radio.module';
import { SegmentModule } from './pages/segment/segment.module';
import { SelectModule } from './pages/select/select.module';
import { SlideToggleModule } from './pages/slide-toggle/slide-toggle.module';
import { SlidersModule } from './pages/sliders/sliders.module';
import { StarsModule } from './pages/stars/stars.module';
import { StateboxModule } from './pages/statebox/statebox.module';
import { CheckboxListModule } from './pages/checkbox-list/checkbox-list.module';
import { TableModule } from './pages/table/table.module';
import { BadgeModule } from './pages/badge/badge.module';
import { ProgressBarModule } from './pages/progress-bar/progress-bar.module';
import { SpinnerModule } from './pages/spinner/spinner.module';

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
        IconButtonModule,
        FabModule,
        CheckboxModule,
        CheckboxListModule,
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
        DividerModule,
        RadioModule,
        FileDropAreaModule,
        FileInputModule,
        TableModule,
        BadgeModule,
        ProgressBarModule,
        SpinnerModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
