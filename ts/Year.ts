/*import { Day } from "./Day.js";
import { intToRoman, createDayFinder } from "./helpFunctions.js";
import { weekdays } from "../dictionaries/weekdays.js";
import { months } from "../dictionaries/months.js";
import { holidays } from "../dictionaries/holidays.js";
import { floatingHolidaysDates } from "../dictionaries/floatingHolidaysDates.js";
import { daysExchanges } from "../dictionaries/daysExchanges.js";*/
import { Day } from "./Day.js";
import { intToRoman } from "./helpFunctions.js";

export class Year {
  days: Array<Day>;
  dayFinder: Map<string, Day>;
  _number: number;

  constructor(num: number) {
    // Days of the year
    this._number = num ? num : new Date().getFullYear();
    this.days = [];
    const start = new Date(this.number, 0, 1); // January 1st
    const end = new Date(this.number + 1, 0, 1); // January 1st of the next year number
    for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
      const dayNumber = date.getDate();
      const weekday = date.getDay();
      const month = Number(date.getMonth()) + 1;
      const day = new Day(this.number, month, dayNumber, weekday);
      day.monthName = intToRoman(day.month);
      day.working = weekday !== 0 && weekday !== 6;
      this.days.push(day);
    }
    // Linking to previous and next days
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].previous = i > 0 ? this.days[i - 1] : null;
      this.days[i].next = i < this.days.length - 1 ? this.days[i + 1] : null;
    }
    // Day finder for fast access to days by their date
    this.dayFinder = new Map<string, Day>(
      this.days.map((day) => {
        const hashKey = `${this.number}-${day.month}-${day.date}`;
        return [hashKey, day];
      }),
    );
  }

  find(day: string) {
    return this.dayFinder.get(day);
  }

  set number(value) {
    this._number = value;
  }

  get number() {
    return this._number;
  }
}
