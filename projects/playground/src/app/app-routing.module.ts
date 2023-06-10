import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPage } from './pages/button/button.page';
import { CalendarPage } from './pages/calendar/calendar.page';
import { CheckboxPage } from './pages/checkbox/checkbox.page';
import { ChipsPage } from './pages/chips/chips.page';
import { ColorDisplayPage } from './pages/color-display/color-display.page';
import { ColorPickerPage } from './pages/color-picker/color-picker.page';
import { FabPage } from './pages/fab/fab.page';
import { HomePage } from './pages/home/home.page';
import { IconPage } from './pages/icon/icon.page';
import { InputsPage } from './pages/inputs/inputs.page';
import { KbdShortcutPage } from './pages/kbd-shortcut/kbd-shortcut.page';
import { KbdPage } from './pages/kbd/kbd.page';
import { SegmentPage } from './pages/segment/segment.page';
import { SelectPage } from './pages/select/select.page';
import { SlideTogglePage } from './pages/slide-toggle/slide-toggle.page';
import { SlidersPage } from './pages/sliders/sliders.page';
import { StarsPage } from './pages/stars/stars.page';
import { StateboxPage } from './pages/statebox/statebox.page';

const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'segment', component: SegmentPage },
    { path: 'select', component: SelectPage },
    { path: 'button', component: ButtonPage },
    { path: 'fab', component: FabPage },
    { path: 'checkbox', component: CheckboxPage },
    { path: 'statebox', component: StateboxPage },
    { path: 'slide-toggle', component: SlideTogglePage },
    { path: 'stars', component: StarsPage },
    { path: 'chips', component: ChipsPage },
    { path: 'icon', component: IconPage },
    { path: 'color-display', component: ColorDisplayPage },
    { path: 'color-picker', component: ColorPickerPage },
    { path: 'calendar', component: CalendarPage },
    { path: 'kbd', component: KbdPage },
    { path: 'kbd-shortcut', component: KbdShortcutPage },
    { path: 'sliders', component: SlidersPage, loadChildren: () => import('./pages/sliders/sliders.module').then(m => m.SlidersModule) },
    { path: 'inputs', component: InputsPage, loadChildren: () => import('./pages/inputs/inputs.module').then(m => m.InputsModule) },
    //redirects
    { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
