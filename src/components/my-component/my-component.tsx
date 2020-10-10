import { Component, Prop, h, Watch, EventEmitter, State, Event } from '@stencil/core';
import { CalendarEntry } from '../../utils/calendar-entry';
import { Calendar } from '../../utils/calendar';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() dayNames = [
    'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'
  ];
  @Prop() monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  @Prop() showFillDays = true;

  @State() date = Calendar.getToday();
  @State() daysInMonth: number[];
  @State() selectedDate: CalendarEntry;
  @State() eventDates = [];

  @Event({
    eventName: 'dayChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) dayChanged: EventEmitter<CalendarEntry>;
  @Event({
    eventName: 'monthChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) monthChanged: EventEmitter<CalendarEntry>;

  private fillStartCount: number;
  private fillEndCount: number;
  readonly today: CalendarEntry;

  constructor() {
    this.today = Calendar.getToday();
  }

  @Watch('date')
  watchDate(date: CalendarEntry): void {
    if ('month' in date && 'year' in date) {
      this.selectedDate = date;
    }
  }

  componentWillLoad() {
    this.setCalendarDetails();
  }

  setCalendarDetails(): void {
    const date = this.getValidDate();
    const calendar = new Calendar(date.year, date.month);
    this.daysInMonth = calendar.getCalendarDays();

    this.fillStartCount = calendar.getFillStartCount();
    this.fillEndCount = (calendar.daysInCalendar - calendar.getFillEndCount());
  }

  getValidDate(): CalendarEntry {
    let date = this.date;
    if (!('month' in this.date && 'year' in this.date)) {
      date = this.today;
    }

    return date;
  }

  dayChangedHandler(calendarEntry: CalendarEntry): void {
    this.dayChanged.emit(calendarEntry);
  }

  daySelectedHandler = (day): void => {
    this.selectedDate = {
      day,
      month: this.date.month,
      year: this.date.year
    };
    this.dayChangedHandler(this.selectedDate);
  }

  monthChangedHandler(calendarEntry: CalendarEntry): void {
    this.monthChanged.emit(calendarEntry);
  }

  switchToPreviousMonth = (): void => {
    if (this.date.month !== 1) {
      this.date.month -= 1;
    } else {
      this.date.month = 12;
      this.date.year -= 1;
    }

    if (typeof this.date !== 'undefined') {
      delete this.date.day;
    }

    this.setCalendarDetails();
    this.monthChangedHandler(this.date);
  }

  switchToNextMonth = (): void => {
    if (this.date.month !== 12) {
      this.date.month += 1;
    } else {
      this.date.month = 1;
      this.date.year += 1;
    }

    delete this.date.day;

    this.setCalendarDetails();
    this.monthChangedHandler(this.date);
  }

  getDigitClassNames = (day: number, month: number, year: number, index: number): string => {
    let classNameDigit = [];
    if (day.toString().length === 1) {
      classNameDigit.push('padding-single-digit');
    }

    if (this.isToday(day, month, year, index)) {
      classNameDigit.push('active');
    }

    if (this.isSelectedDay(day, index)) {
      classNameDigit.push('selected');
    }

    if (this.eventDates.includes(day)) {
      classNameDigit.push('has-event');
    }

    return classNameDigit.join(' ');
  }

  isToday(day: number, month: number, year: number, index: number): boolean {
    return this.today.day === day
      && this.today.month === month
      && this.today.year === year
      && this.today.year === year
      && !(index < this.fillStartCount || index >= this.fillEndCount);
  }

  isSelectedDay(day: number, index: number) {
    return typeof this.selectedDate !== 'undefined'
      && this.selectedDate.day === day
      && this.selectedDate.month === this.date.month
      && this.selectedDate.year === this.date.year
      && !(index < this.fillStartCount || index >= this.fillEndCount);
  }

  render() {
    const date = this.getValidDate();

    return (
      <div class="calendar material">
        <header>
          <span onClick={this.switchToPreviousMonth}>
            {'<'}
          </span>
          <span>{this.monthNames[date.month - 1]} {date.year}</span>
          <span onClick={this.switchToNextMonth}>
             {'>'}
          </span>
        </header>
        <div class="day-names">
          {this.dayNames.map(dayName => <span>{dayName}</span>)}
        </div>
        <div class="days-in-month">
          {this.daysInMonth.map((day, index) => {
            const classNameDigit = this.getDigitClassNames(day, date.month, date.year, index);
            if (index < this.fillStartCount || index >= this.fillEndCount) {
              return (
                <span class="disabled">{this.showFillDays ? day : ''}</span>
              );
            } else {
              return (
                <span onClick={() => this.daySelectedHandler(day)}>
                  <i class={classNameDigit}>
                    {day}
                  </i>
                </span>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
