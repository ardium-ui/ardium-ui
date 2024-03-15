import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonPage } from './pages/button/button.page';
import { CalendarPage } from './pages/calendar/calendar.page';
import { CardPage } from './pages/card/card.page';
import { CheckboxPage } from './pages/checkbox/checkbox.page';
import { ChipsPage } from './pages/chips/chips.page';
import { ColorDisplayPage } from './pages/color-display/color-display.page';
import { ColorPickerPage } from './pages/color-picker/color-picker.page';
import { DividerPage } from './pages/divider/divider.page';
import { FabPage } from './pages/fab/fab.page';
import { FileDropAreaPage } from './pages/file-drop-area/file-drop-area.page';
import { HomePage } from './pages/home/home.page';
import { IconButtonPage } from './pages/icon-button/icon-button.page';
import { IconPage } from './pages/icon/icon.page';
import { InputsPage } from './pages/inputs/inputs.page';
import { KbdShortcutPage } from './pages/kbd-shortcut/kbd-shortcut.page';
import { KbdPage } from './pages/kbd/kbd.page';
import { ProgressCirclePage } from './pages/progress-circle/progress-circle.page';
import { RadioPage } from './pages/radio/radio.page';
import { ProgressBarPage } from './pages/progress-bar/progress-bar.page';
import { SegmentPage } from './pages/segment/segment.page';
import { SelectPage } from './pages/select/select.page';
import { SlideTogglePage } from './pages/slide-toggle/slide-toggle.page';
import { SlidersPage } from './pages/sliders/sliders.page';
import { StarsPage } from './pages/stars/stars.page';
import { StateboxPage } from './pages/statebox/statebox.page';
import { CheckboxListPage } from './pages/checkbox-list/checkbox-list.page';
import { TablePage } from './pages/table/table.page';
import { BadgePage } from './pages/badge/badge.page';
import { SpinnerPage } from './pages/spinner/spinner.page';
import { ModalPage } from './pages/modal/modal.page';
import { DialogPage } from './pages/dialog/dialog.page';
import { SnackbarPage } from './pages/snackbar/snackbar.page';

const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'segment', component: SegmentPage },
    { path: 'select', component: SelectPage },
    { path: 'icon-button', component: IconButtonPage },
    { path: 'button', component: ButtonPage },
    { path: 'fab', component: FabPage },
    { path: 'checkbox', component: CheckboxPage },
    { path: 'checkbox-list', component: CheckboxListPage },
    { path: 'statebox', component: StateboxPage },
    { path: 'slide-toggle', component: SlideTogglePage },
    { path: 'stars', component: StarsPage },
    { path: 'chips', component: ChipsPage },
    { path: 'icon', component: IconPage },
    { path: 'table', component: TablePage },
    { path: 'color-display', component: ColorDisplayPage },
    { path: 'color-picker', component: ColorPickerPage },
    { path: 'calendar', component: CalendarPage },
    { path: 'progress-circle', component: ProgressCirclePage },
    { path: 'kbd', component: KbdPage },
    { path: 'kbd-shortcut', component: KbdShortcutPage },
    { path: 'card', component: CardPage },
    { path: 'divider', component: DividerPage },
    { path: 'radio', component: RadioPage },
    { path: 'badge', component: BadgePage },
    { path: 'file-drop-area', component: FileDropAreaPage },
    { path: 'progress-bar', component: ProgressBarPage },
    { path: 'spinner', component: SpinnerPage },
    { path: 'modal', component: ModalPage },
    { path: 'dialog', component: DialogPage },
    { path: 'snackbar', component: SnackbarPage },
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
