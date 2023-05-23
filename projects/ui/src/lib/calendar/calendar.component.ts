import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, Output, TemplateRef, ViewEncapsulation, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ArdActionButtonsTemplateDirective, ArdDaysViewHeaderTemplateDirective, ArdDayTemplateDirective, ArdFloatingMonthTemplateDirective, ArdMonthsViewHeaderTemplateDirective, ArdMonthTemplateDirective, ArdWeekdayTemplateDirective, ArdYearsViewHeaderTemplateDirective, ArdYearTemplateDirective } from './calendar.directives';
import { toCalendarArray } from './calendar.helpers';
import { ActiveCalendarView, CalendarActionButtonsContext, CalendarDayContext, CalendarDaysViewHeaderContext, CalendarFloatingMonthContext, CalendarMonthContext, CalendarMonthsViewHeaderContext, CalendarWeekdayContext, CalendarYearContext, CalendarYearsViewHeaderContext, DateRange } from './calendar.types';

@Component({
  selector: 'ard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumCalendarComponent extends _NgModelComponentBase implements OnInit {

    ngOnInit(): void {
        this._updateCalendarArray();
        this._updateWeekdayArray();
    }

    //! determining today state
    todayDate: Date = new Date();

    isDayToday(day: number | null): boolean {
        return (
            this.activeYear == this.todayDate.getFullYear()
            && this.activeMonth == this.todayDate.getMonth()
            && day == this.todayDate.getDate()
        );
    }
    isMonthToday(month: number): boolean { //TODO
        return (
            this.activeYear == this.todayDate.getFullYear()
            && month == this.todayDate.getMonth()
        );
    }
    isYearToday(year: number): boolean { //TODO
        return year == this.todayDate.getFullYear();
    }

    //! determining if an entry is selected
    isDaySelected(day: number | Date | null): boolean {
        if (day instanceof Date) day = day.getDate();
        return (
            this.selected != null
            && this.activeYear == this.selected.getFullYear()
            && this.activeMonth == this.selected.getMonth()
            && day == this.selected.getDate()
        );
    }
    isMonthSelected(month: number | Date): boolean {
        if (month instanceof Date) month = month.getMonth();
        return (
            this.selected != null
            && this.activeYear == this.selected.getFullYear()
            && month == this.selected.getMonth()
        );
    }
    isYearSelected(year: number | Date): boolean {
        if (year instanceof Date) year = year.getFullYear();
        return (
            this.selected != null
            && year == this.selected.getFullYear()
        )
    }

    //! color & wrapper classes
    @Input() color: ComponentColor = ComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
            this.nointeract ? 'ard-calendar-nointeract' : '',
            this.staticHeight ? 'ard-calendar-static-height' : '',
        ].join(' ');
    }

    //! open year & month setters
    get activeYearRangeStart(): number {
        const year = this.activeYear;
        const yearModulo = year % 4;
        //this keeps the active year always in the third line
        return year - yearModulo - 8;
    }

    yearRangeArrayCache: number[] | null = null;
    get yearRangeArray(): number[] {
        if (!this.yearRangeArrayCache) {
            let yearRangeStart = this.activeYearRangeStart;
            const newArray = new Array(24).map(() => yearRangeStart++);
            this.yearRangeArrayCache = newArray;
        }
        return this.yearRangeArrayCache;
    }

    protected _activeDate: Date = new Date();
    set activeDate(v: Date | string | number) {
        const newDate = new Date(v);
        if (this.activeYear != newDate.getFullYear()) this.yearRangeArrayCache = null;
        this._activeDate = newDate;

        this._updateCalendarArray();
    }
    get activeDate(): Date { return this._activeDate; }

    get activeYear(): number { return this._activeDate.getFullYear(); }
    @Input()
    set activeYear(v: any) {
        const year = coerceNumberProperty(v, new Date().getFullYear());
        this._activeDate.setFullYear(year);
        this.activeDate = new Date(year, this.activeMonth, 1);
        this.yearRangeArrayCache = null;

        this._updateCalendarArray();
    }

    get activeMonth(): number { return this._activeDate.getMonth(); }
    @Input()
    set activeMonth(v: any) {
        const month = coerceNumberProperty(v, new Date().getMonth());
        const oldDateYear = this.activeYear;
        this.activeDate = new Date(this.activeYear, month, 1);
        if (oldDateYear != this.activeYear) this.yearRangeArrayCache = null;

        this._updateCalendarArray();
    }
    //! selection functions
    protected _selected: Date | null = null;
    set selected(v: any) {
        this.writeValue(v);
    }
    get selected(): Date | null { return this._selected; }

    writeValue(v: any): void {
        if (typeof v == 'string') {
            //try to see if it is an array of numbers separated by a comma
            const vAsArray1 = v.split(',').map(v => Number(v));
            if (vAsArray1.length >= 1 && vAsArray1.length <= 3 && vAsArray1.every(v => !isNaN(v))) {
                v = new Date(vAsArray1[0], vAsArray1[1] ?? 0, vAsArray1[2] ?? 1);
            }
            else {
            //try to see if it is an array of numbers separated by some whitespace
                const vAsArray2 = v.split(/\s/).map(v => Number(v));
                if (vAsArray2.length >= 1 && vAsArray2.length <= 3 && vAsArray2.every(v => !isNaN(v))) {
                    v = new Date(vAsArray2[0], vAsArray2[1] ?? 0, vAsArray2[2] ?? 1);
                }
                else {
                    v = new Date(v);
                }
            }
        }
        //is a Date object && does not contain an error
        if (v instanceof Date && !isNaN(v.valueOf())) {
            this._selected = v;
            return;
        }
        if (v == null) {
            this._selected = null;
            return;
        }
        console.warn(`Could not parse [selected] value on <ard-calendar>, as it is not a valid value. Provided value: "${v}"`);
        this._selected = null;
    }

    selectDay(day: number | Date): void {
        if (this.isDaySelected(day)) return;

        if (day instanceof Date) day = day.getDate();

        this.selected = new Date(this.activeYear, this.activeMonth, day);
        this._emitChange();
    }
    selectMonth(month: number | Date): void {
        if (month instanceof Date) month = month.getMonth();

        this.activeMonth = month;

        this.activeMonthChange.emit(month);
        this.monthSelected.emit(month);
    }
    selectYear(year: number): void {
        this.activeYear = year;

        this.activeYearChange.emit(year);
        this.yearSelected.emit(year);
    }

    //! range support
    getDateRangeClasses(day: number | null): string { //TODO
        if (day == null) return '';

        return [

        ].join(' ');
    }

    //! output events
    @Output() yearSelected = new EventEmitter<number>();
    @Output() monthSelected = new EventEmitter<number>();

    @Output() selectedChange = new EventEmitter<Date | null>();
    @Output() activeYearChange = new EventEmitter<number>();
    @Output() activeMonthChange = new EventEmitter<number>();

    @Output('change') changeEvent = new EventEmitter<Date | null>();

    private _emitChange(): void {
        const v = this.selected;
        this._onChangeRegistered?.(v);
        this.selectedChange.emit(v);
        this.changeEvent.emit(v);
    }

    //! calendar entry hover & click
    highlightedDay: number | null = null;

    onCalendarDayMouseover(day: number | null): void {
        if (day == null) return;

        this.highlightedDay = day;
    }

    @HostListener('document:mousemove')
    onMousemove(): void {
        this.highlightedDay = null;
    }
    
    onCalendarDayClick(day: number | null): void {
        if (day == null) return;

        this.selectDay(day);
    }

    //! settings
    protected _firstWeekday: number = 0;
    @Input()
    get firstWeekday(): number { return this._firstWeekday; }
    set firstWeekday(v: any) {
        this._firstWeekday = coerceNumberProperty(v, 0) % 7;

        this._updateCalendarArray();
        this._updateWeekdayArray();
    }

    protected _nointeract: boolean = false;
    @Input()
    get nointeract(): boolean { return this._nointeract || this.disabled; }
    set nointeract(v: any) { this._nointeract = coerceBooleanProperty(v); }

    protected _staticHeight: boolean = false;
    @Input()
    get staticHeight(): boolean { return this._staticHeight; }
    set staticHeight(v: any) { this._staticHeight = coerceBooleanProperty(v); }

    //! calendar array
    calendarArray!: (number | null)[][];

    reserveTopRow!: boolean;

    protected _updateCalendarArray(): void {
        const resultObj = toCalendarArray(this._activeDate, this.firstWeekday);

        this.reserveTopRow = resultObj.leadingSpaces <= 3;
        this.calendarArray = resultObj.array;
    }

    //! weekday array
    weekdayArray!: number[];

    protected _updateWeekdayArray(): void {
        this.weekdayArray = [0, 1, 2, 3, 4, 5, 6].map(v => (v + this.firstWeekday) % 7);
    }

    //! change view functions
    activeView: ActiveCalendarView = ActiveCalendarView.Days;

    @Input()
    set startView(v: ActiveCalendarView) {
        this.activeView = v;
    }

    openYearsView(): void {
        this.activeView = ActiveCalendarView.Years;
    }
    openMonthsView(): void {
        this.activeView = ActiveCalendarView.Months;
    }
    openDaysView(): void {
        this.activeView = ActiveCalendarView.Days;
    }

    //! template customization
    //headers
    @ContentChild(ArdYearsViewHeaderTemplateDirective) yearsViewHeaderTemplate?: TemplateRef<CalendarYearsViewHeaderContext>;
    @ContentChild(ArdMonthsViewHeaderTemplateDirective) monthsViewHeaderTemplate?: TemplateRef<CalendarMonthsViewHeaderContext>;
    @ContentChild(ArdDaysViewHeaderTemplateDirective) daysViewHeaderTemplate?: TemplateRef<CalendarDaysViewHeaderContext>;
    //weekday
    @ContentChild(ArdWeekdayTemplateDirective) weekdayTemplate?: TemplateRef<CalendarWeekdayContext>;
    //floating month
    @ContentChild(ArdFloatingMonthTemplateDirective) floatingMonthTemplate?: TemplateRef<CalendarFloatingMonthContext>;
    //grid elements (year, month, day)
    @ContentChild(ArdYearTemplateDirective) yearTemplate?: TemplateRef<CalendarYearContext>;
    @ContentChild(ArdMonthTemplateDirective) monthTemplate?: TemplateRef<CalendarMonthContext>;
    @ContentChild(ArdDayTemplateDirective) dayTemplate?: TemplateRef<CalendarDayContext>;
    //action buttons
    @ContentChild(ArdActionButtonsTemplateDirective) actionButtonsTemplate?: TemplateRef<CalendarActionButtonsContext>;

    //! context getters
    //headers
    getYearsViewHeaderContext(): CalendarYearsViewHeaderContext {
        const yearRangeStart = this.activeYearRangeStart;
        const yearRangeEnd = yearRangeStart + 23;
        const dateRange: DateRange = {
            low: new Date(yearRangeStart, 0, 1),
            high: new Date(yearRangeEnd, 0, 1),
        };
        return {
            nextPage: () => { this.activeYear += 24; },
            prevPage: () => { this.activeYear -= 24; },
            openDaysView: () => { this.openDaysView(); },
            yearRange: {
                low: yearRangeStart,
                high: yearRangeEnd,
            },
            dateRange,
            $implicit: dateRange,
        };
    }
    getMonthsViewHeaderContext(): CalendarMonthsViewHeaderContext {
        return {
            openYearsView: () => { this.openYearsView() },
            openDaysView: () => { this.openDaysView() },
            year: this.activeYear,
            date: this.activeDate,
            $implicit: this.activeYear,
        };
    }
    getDaysViewHeaderContext(): CalendarDaysViewHeaderContext {
        return {
            nextMonth: () => { this.activeMonth += 1; },
            prevMonth: () => { this.activeMonth -= 1; },
            nextYear: () => { this.activeYear += 1; },
            prevYear: () => { this.activeYear -= 1; },
            openYearsView: () => { this.openYearsView() },
            openMonthsView: () => { this.openMonthsView() },
            year: this.activeYear,
            month: this.activeMonth,
            date: this.activeDate,
            $implicit: this.activeDate,
        };
    }
    //weekday
    getWeekdayContext(dayIndex: number): CalendarWeekdayContext {
        const date = new Date(1970, 0, 4 + dayIndex);
        return {
            dayIndex,
            date,
            $implicit: date,
        };
    }
    //floating month
    getFloatingMonthContext(): CalendarFloatingMonthContext {
        return {
            month: this.activeMonth,
            date: this.activeDate,
            $implicit: this.activeDate,
        }
    }
    //grid elements (year, month, day)
    getYearContext(year: number): CalendarYearContext {
        return {
            value: year,
            date: new Date(this.activeYear, 0, 1),
            $implicit: year,
            select: (year: number) => { this.selectYear(year); },
        };
    }
    getMonthContext(month: number): CalendarMonthContext {
        const date = new Date(this.activeYear, month, 1)
        return {
            month,
            date,
            $implicit: date,
            select: (month: number | Date) => { this.selectMonth(month); },
        };
    }
    getDayContext(day: number): CalendarDayContext {
        return {
            value: day,
            date: new Date(this.activeYear, this.activeMonth, day),
            $implicit: day,
            select: (day: number | Date) => { this.selectDay(day); },
        }
    }
    getActionButtonsContext(): CalendarActionButtonsContext {
        return {
            cancel: () => { }, //TODO
            apply: () => { }, //TODO
            reset: () => { this.activeDate = new Date(); this.selected = null; },
        }
    }
}
