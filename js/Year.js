import { Day } from "./Day.js";
import { intToRoman } from "./helpFunctions.js";

export class Year {
  constructor(yearNumber) {
    this.yearNum = yearNumber ? yearNumber : new Date().getFullYear();
    this.days = [];
    const start = new Date(this.yearNum, 0, 1); // January 1st
    const end = new Date(this.yearNum + 1, 0, 1); // January 1st of the next yearNumber
    for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
      const dayNumber = date.getDate();
      const weekday = date.getDay();
      const month = Number(date.getMonth()) + 1;
      const day = new Day(this.yearNum, month, dayNumber, weekday);
      day.monthName = intToRoman(day.month);
      day.working = weekday !== 0 && weekday !== 6;
      this.days.push(day);
    }
    // Linking to previous and next days
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].previous = i > 0 ? this.days[i - 1] : null;
      this.days[i].next = i < this.days.length - 1 ? this.days[i + 1] : null;
    }
    this.createHashMap(this.yearNum);
  }

  createHashMap(year) {
    const yearNum = year;
    this.yearDatesMap = new Map(
      this.days.map(function (obj) {
        const hashKey = `${yearNum}-${obj.month}-${obj.date}`;
        return [hashKey, obj];
      }),
    );
  }
}
