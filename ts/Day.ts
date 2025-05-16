export class Day {
  year: number;
  month: number;
  date: number;
  weekday: number;
  monthName?: string;
  working?: boolean;
  previous?: Day | null;
  next?: Day | null;

  constructor(year: number, month: number, date: number, weekday: number) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.weekday = weekday;
  }
}
