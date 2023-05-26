import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, Output, TemplateRef, ViewEncapsulation, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ArdActionButtonsTemplateDirective, ArdDaysViewHeaderTemplateDirective, ArdDayTemplateDirective, ArdFloatingMonthTemplateDirective, ArdMonthsViewHeaderTemplateDirective, ArdMonthTemplateDirective, ArdWeekdayTemplateDirective, ArdYearsViewHeaderTemplateDirective, ArdYearTemplateDirective } from './calendar.directives';
import { toCalendarArray } from './calendar.helpers';
import { ActiveCalendarView, CalendarActionButtonsContext, CalendarDayContext, CalendarDaysViewHeaderContext, CalendarFloatingMonthContext, CalendarMonthContext, CalendarMonthsViewHeaderContext, CalendarWeekdayContext, CalendarYearContext, CalendarYearsViewHeaderContext, DateRange } from './calendar.types';
import { isDefined } from 'simple-bool';
import { isNull } from 'simple-bool';

function isLeapYear(year: number): boolean {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

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

    @Output('reset') resetEvent = new EventEmitter<any>();
    @Output('cancel') cancelEvent = new EventEmitter<any>();
    @Output('apply') applyEvent = new EventEmitter<Date | null>();

    private _emitChange(): void {
        const v = this.selected;
        this._onChangeRegistered?.(v);
        this.selectedChange.emit(v);
        this.changeEvent.emit(v);
    }

    //! calendar entry hover & click
    private _highlightedDay: number | null = null;
    get highlightedDay(): number | null { return this._highlightedDay; }
    set highlightedDay(v: number | null) {
        if (isNull(v)) {
            this._highlightedDay = v;
            return;
        }
        const date = new Date(this.activeYear, this.activeMonth, v);
        this.activeDate = date;
        this._highlightedDay = date.getDate();
    }

    private _highlightedMonth: number | null = null;
    get highlightedMonth(): number | null { return this._highlightedMonth; }
    set highlightedMonth(v: number | null) {
        if (isNull(v)) {
            this._highlightedMonth = v;
            return;
        }
        const date = new Date(this.activeYear, v, 1);
        this.activeYear = date.getFullYear();
        this._highlightedMonth = date.getMonth();
    }

    private _highlightedYear: number | null = null;
    get highlightedYear(): number | null { return this._highlightedYear; }
    set highlightedYear(v: number | null) {
        if (isNull(v)) {
            this._highlightedYear = v;
            return;
        }
        this._highlightedYear = v;
    }

    get currentAriaLabel(): string {
        return new Date(this.activeYear, this.activeMonth, this.highlightedDay ?? 1)
            .toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
    }

    onCalendarDayMouseover(day: number | null): void {
        if (day == null) return;
        if (this._isUsingKeyboard) return;

        this.highlightedDay = day;
    }

    private _isUsingKeyboard: boolean = false;
    @HostListener('document:mousemove')
    onDocumentMousemove(): void {
        if (!this._isUsingKeyboard)
            this.highlightedDay = null;
        
        this._isUsingKeyboard = false;
    }
    @HostListener('document:keydown')
    onDocumentKeydown(): void {
        this._isUsingKeyboard = true;
    }

    onCalendarDayClick(day: number | null): void {
        if (day == null) return;

        this.selectDay(day);
    }

    onDayGridFocus(): void {
        this.highlightedDay = 1;
    }
    onDayGridBlur(): void {
        this.highlightedDay = null;
    }
    onDayGridClick(): void {
        this.highlightedDay ??= 1;
    }

    //! main grid keyboard controls
    onMainGridKeydown(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this._onEnterPress(event);
                break;
            case 'ArrowUp':
                this._onArrowUpPress(event);
                break;
            case 'ArrowDown':
                this._onArrowDownPress(event);
                break;
            case 'ArrowLeft':
                this._onArrowLeftPress(event);
                break;
            case 'ArrowRight':
                this._onArrowRightPress(event);
                break;
            case 'Home':
                this._onHomePress(event);
                break;
            case 'End':
                this._onEndPress(event);
                break;
            case 'PageUp':
                this._onPageUpPress(event);
                break;
            case 'PageDown':
                this._onPageDownPress(event);
                break;

            default:
                return;
        }
    }
    //select currently selected entry
    private _onEnterPress(event: KeyboardEvent): void {
        event.preventDefault();

        this.selectCurrentlyHighlighted();
    }
    //highlight the entry one line above
    private _onArrowUpPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightPreviousDay(7);
                break;
            case ActiveCalendarView.Months:
                this.highlightPreviousMonth(3); //3 months per line
                break;
            case ActiveCalendarView.Years:
                this.highlightPreviousYear(4); //4 years per line
                break;
        }
    }
    //highlight the entry one line below
    private _onArrowDownPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightNextDay(7);
                break;
            case ActiveCalendarView.Months:
                this.highlightNextMonth(3); //3 months per line
                break;
            case ActiveCalendarView.Years:
                this.highlightNextYear(4); //4 years per line
                break;
        }
    }
    //highlight previous entry
    private _onArrowLeftPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightPreviousDay();
                break;
            case ActiveCalendarView.Months:
                this.highlightPreviousMonth();
                break;
            case ActiveCalendarView.Years:
                this.highlightPreviousYear();
                break;
        }
    }
    //highlight next entry
    private _onArrowRightPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightNextDay();
                break;
            case ActiveCalendarView.Months:
                this.highlightNextMonth();
                break;
            case ActiveCalendarView.Years:
                this.highlightNextYear();
                break;
        }
    }
    //highlight first entry on the page
    private _onHomePress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightFirstDay();
                break;
            case ActiveCalendarView.Months:
                this.highlightFirstMonth();
                break;
            case ActiveCalendarView.Years:
                this.highlightFirstYear();
                break;
        }
    }
    //highlight last entry on the page
    private _onEndPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.highlightLastDay();
                break;
            case ActiveCalendarView.Months:
                this.highlightLastMonth();
                break;
            case ActiveCalendarView.Years:
                this.highlightLastYear();
                break;
        }
    }
    //alone: highlight same entry on the previous page
    //with alt: highlight same entry multiple pages before (days view: 12 pages, months view: 10 pages, years view: 5 pages)
    private _onPageUpPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                if (event.altKey) this.highlightSameDayPreviousYear();
                else this.highlightSameDayPreviousMonth();
                break;
            case ActiveCalendarView.Months:
                this.highlightSameMonthPreviousYear(event.altKey);
                break;
            case ActiveCalendarView.Years:
                this.highlightSameYearPreviousPage(event.altKey);
                break;
        }
    }
    //alone: highlight same entry on the next page
    //with alt: highlight same entry multiple pages after (days view: 12 pages, months view: 10 pages, years view: 5 pages)
    private _onPageDownPress(event: KeyboardEvent): void {
        event.preventDefault();
        console.log(event.code);
        switch (this.activeView) {
            case ActiveCalendarView.Days:
                if (event.altKey) this.highlightSameDayNextYear();
                else this.highlightSameDayNextMonth();
                break;
            case ActiveCalendarView.Months:
                this.highlightSameMonthNextYear(event.altKey);
                break;
            case ActiveCalendarView.Years:
                this.highlightSameYearNextPage(event.altKey);
                break;
        }
    }
    //! manipulation methods
    cancel(): void {
        this.selectYear(null);
        this.selectMonth(null);
        this.selectDay(null);

        this.cancelEvent.emit();
    }
    apply(): void {
        this.selectDay(this.highlightedDay);

        this.applyEvent.emit();
    }
    reset(): void {
        this.selectYear(this.todayDate);
        this.selectMonth(this.todayDate);
        this.selectDay(null);
        this.highlightedDay = this.todayDate.getDate();
    }
    //selecting
    selectDay(day: number | Date | null): void {
        if (this.isDaySelected(day)) return;
        if (isNull(day)) {
            if (!isDefined(this.selected)) return;

            this.selected = null;
            this._emitChange();
            return;
        }

        if (day instanceof Date) day = day.getDate();

        this.selected = new Date(this.activeYear, this.activeMonth, day);
        this._emitChange();
    }
    selectMonth(month: number | Date | null): void {
        if (isNull(month)) {
            this.activeMonth = null;
            return;
        }
        if (month instanceof Date) month = month.getMonth();

        this.activeMonth = month;

        this.activeMonthChange.emit(month);
        this.monthSelected.emit(month);
    }
    selectYear(year: number | Date | null): void {
        if (isNull(year)) {
            this.activeYear = null;
            return;
        }
        if (year instanceof Date) year = year.getFullYear();

        this.activeYear = year;

        this.activeYearChange.emit(year);
        this.yearSelected.emit(year);
    }
    selectCurrentlyHighlighted(): void {
        if (!isDefined(this.highlightedDay)) return;

        switch (this.activeView) {
            case ActiveCalendarView.Days:
                this.selectDay(this.highlightedDay);
                return;
            case ActiveCalendarView.Months:
                this.selectMonth(this.highlightedMonth);
                return;
            case ActiveCalendarView.Years:
                this.selectYear(this.highlightedYear);
                return;

            default:
                return;
        }
    }
    //active months/years
    changeMonth(offset: number): void {
        this.activeMonth += offset;

        this.activeMonthChange.emit(this.activeMonth);
    }
    changeYear(offset: number): void {
        this.activeYear += offset;

        this.activeYearChange.emit(this.activeYear);
    }
    //next/prev highlighting
    highlightNextDay(offset: number = 1): void {
        if (this.highlightedDay) this.highlightedDay += offset;
        else this.highlightedDay = 1;
    }
    highlightPreviousDay(offset: number = 1): void {
        if (this.highlightedDay) this.highlightedDay -= offset;
        else this.highlightedDay = 1;
    }
    highlightNextMonth(offset: number = 1): void {
        if (this.highlightedMonth) this.highlightedMonth += offset;
        else this.highlightedMonth = 0;
    }
    highlightPreviousMonth(offset: number = 1): void {
        if (this.highlightedMonth) this.highlightedMonth -= offset;
        else this.highlightedMonth = 0;
    }
    highlightNextYear(offset: number = 1): void {
        if (this.highlightedYear) this.highlightedYear += offset;
        else this.highlightedYear = this.activeYearRangeStart;
    }
    highlightPreviousYear(offset: number = 1): void {
        if (this.highlightedYear) this.highlightedYear -= offset;
        else this.highlightedYear = this.activeYearRangeStart;
    }
    //first/last highlighting
    highlightFirstDay(): void {
        this.highlightedDay = 1;
    }
    highlightLastDay(): void {
        switch (this.activeMonth + 1) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                this.highlightedDay = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                this.highlightedDay = 30;
                break;
            case 2:
                if (isLeapYear(this.activeYear)) this.highlightedDay = 29;
                else this.highlightedDay = 28;
        }
    }
    highlightFirstMonth(): void {
        this.highlightedMonth = 0;
    }
    highlightLastMonth(): void {
        this.highlightedMonth = 11;
    }
    highlightFirstYear(): void {
        this.highlightedYear = this.activeYearRangeStart;
    }
    highlightLastYear(): void {
        this.highlightedYear = this.activeYearRangeStart + 23; //24 years per page
    }
    //same day nextprev month/year
    highlightSameDayNextMonth(): void {
        this.activeMonth++;

        this._fixDateAfterMonthChange();
    }
    highlightSameDayPreviousMonth(): void {
        this.activeMonth--;

        this._fixDateAfterMonthChange();
    }
    private _fixDateAfterMonthChange(): void {
        switch (this.activeMonth + 1) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                //do nothing
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                //only do if day is 31
                if (this.highlightedDay == 31) this.highlightedDay = 30;
                break;
            case 2: {
                //skip if below 29 or null
                if (!this.highlightedDay || this.highlightedDay < 29) break;

                if (isLeapYear(this.activeYear)) this.highlightedDay = 29;
                else this.highlightedDay = 28;
            }
        }
    }
    highlightSameDayNextYear(): void {
        this.activeYear++;

        this._fixDateAfterYearChange();
    }
    highlightSameDayPreviousYear(): void {
        this.activeYear--;

        this._fixDateAfterYearChange();
    }
    private _fixDateAfterYearChange(): void {
        if (this.highlightedDay != 29) return; //skip if not 29th day is selected
        if (isLeapYear(this.activeYear)) return; //skip if nea year is a leap year
        if (this.activeMonth != 1) return; //skip if not february

        this.highlightedDay = 28;
    }
    //same month next/prev year
    highlightSameMonthNextYear(multiple: boolean): void {
        this.activeYear += multiple ? 10 : 1;
    }
    highlightSameMonthPreviousYear(multiple: boolean): void {
        this.activeYear -= multiple ? 10 : 1;
    }
    //same year next/prev page(s)
    highlightSameYearNextPage(multiple: boolean): void {
        if (this.highlightedYear) this.highlightedYear += multiple ? 60 : 24;
        else this.highlightedYear = this.activeYearRangeStart;
    }
    highlightSameYearPreviousPage(multiple: boolean): void {
        if (this.highlightedYear) this.highlightedYear -= multiple ? 60 : 24;
        else this.highlightedYear = this.activeYearRangeStart;
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

    private _oldActiveYear: number | undefined = undefined;
    openYearsView(): void {
        this.activeView = ActiveCalendarView.Years;

        this._oldActiveYear = this.activeYear;
        this.activeYear = undefined;
        this.activeYearChange.emit(undefined);
    }
    private _oldActiveMonth: number | undefined = undefined;
    openMonthsView(): void {
        this.activeView = ActiveCalendarView.Months;
        //bring back old value
        const oldYear = this.activeYear;
        this.activeYear = this.activeYear ?? this._oldActiveYear ?? this.todayDate.getFullYear();
        //reset
        this._oldActiveYear = undefined;

        this._oldActiveMonth = this.activeMonth;
        this.activeMonth = undefined;
        //emit events
        if (oldYear != this.activeYear && this.activeYear == this.todayDate.getFullYear()) this.activeYearChange.emit(this.activeYear);
        this.activeMonthChange.emit(undefined);
    }
    openDaysView(): void {
        this.activeView = ActiveCalendarView.Days;
        //bring back old values
        const oldYear = this.activeYear;
        this.activeYear = this.activeYear ?? this._oldActiveYear ?? this.todayDate.getFullYear();
        const oldMonth = this.activeMonth;
        this.activeMonth = this.activeMonth ?? this._oldActiveMonth ?? this.todayDate.getMonth();
        //reset both
        this._oldActiveYear = this._oldActiveMonth = undefined;
        //emit events
        if (oldYear != this.activeYear && this.activeYear == this.todayDate.getFullYear()) this.activeYearChange.emit(this.activeYear);
        if (oldMonth != this.activeMonth && this.activeMonth == this.todayDate.getMonth()) this.activeMonthChange.emit(this.activeMonth);
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
            nextPage: () => { this.changeYear(+24); },
            prevPage: () => { this.changeYear(-24); },
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
            nextMonth: () => { this.changeMonth(+1); },
            prevMonth: () => { this.changeMonth(-1); },
            nextYear: () => { this.changeYear(+1); },
            prevYear: () => { this.changeYear(-1); },
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
    //action buttons
    getActionButtonsContext(): CalendarActionButtonsContext {
        return {
            cancel: () => { }, //TODO
            apply: () => { }, //TODO
            reset: () => { this.reset(); },
        }
    }
}
