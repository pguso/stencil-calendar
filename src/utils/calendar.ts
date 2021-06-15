import { CalendarEntry } from './calendar-entry';

export class Calendar {
  readonly year: number;
  readonly month: number;
  readonly daysInCalendarWithFiveRows = 42;
  readonly daysInCalendarWithFourRows = 35;
  readonly daysInCalendarWithThreeRows = 28;

  public daysInCalendar = this.daysInCalendarWithFourRows;

  private fillStartCount = 0;
  private fillEndCount = 0;
  private currentMonthCount: number;
  private fillCount = [6, 0, 1, 2, 3, 4, 5];

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  public getCalendarDays(): number[] {
    const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
    const fillStartCount = this.fillCount[this.getFirstDayOfMonth()];
    const fillEndCount = this.daysInCalendarWithFourRows - (daysOfCurrentMonth.length + fillStartCount);

    this.currentMonthCount = daysOfCurrentMonth.length;
    this.fillStartCount = fillStartCount;
    this.fillEndCount = fillEndCount;

    const fillStart = fillStartCount > 0 ? this.getDaysOfLastMonth(fillStartCount) : [];
    const fillEnd = this.getDaysOfNextMonth(fillEndCount);


    return fillStart.concat(daysOfCurrentMonth).concat(fillEnd);
  }

  private getDaysOfCurrentMonth(): number[] {
    return this.getDaysOfMonth(this.month);
  }

  private getDaysOfLastMonth(fillStartCount: number): number[] {
    const daysOfMonth = this.getDaysOfMonth(this.month - 1);

    return daysOfMonth.slice(-fillStartCount);
  }

  private getDaysOfNextMonth(endCount: number): number[] {
    const daysOfMonth = this.getDaysOfMonth(this.month + 1);

    let slicedDays;
    if (endCount <= -1) {
      endCount = this.daysInCalendarWithFiveRows - (this.currentMonthCount + this.fillStartCount);
      slicedDays = daysOfMonth.slice(0, endCount);
      this.daysInCalendar = this.daysInCalendarWithFiveRows;
      this.fillEndCount = endCount;
    } else if (endCount === 7 && (this.currentMonthCount + this.fillStartCount) === 28) {
      endCount = this.daysInCalendarWithThreeRows - (this.currentMonthCount + this.fillStartCount);
      slicedDays = daysOfMonth.slice(0, endCount);
      this.daysInCalendar = this.daysInCalendarWithThreeRows;
      this.fillEndCount = endCount;
    } else {
      slicedDays = daysOfMonth.slice(0, endCount);
    }

    return slicedDays;
  }

  private getDaysOfMonth(month: number): number[] {
    const daysOfMonth = new Date(this.year, month, 0).getDate();

    return Array.from({length: daysOfMonth}, (_, i) => i + 1);
  }

  public getFirstDayOfMonth(): number {
    return new Date(this.year, this.month - 1, 1).getDay();
  }

  public getFillStartCount(): number {
    return this.fillStartCount;
  }

  public getFillEndCount(): number {
    return this.fillEndCount;
  }

  public static getToday(): CalendarEntry {
    return {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    };
  }

  public static convertNumbersToDate(year, month, day): Date {
    return new Date(`${year}-${month}-${day}`);
  }
}
