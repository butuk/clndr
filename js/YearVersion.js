import { months } from "../dictionaries/months.js";
import { weekdays } from "../dictionaries/weekdays.js";
import { holidays } from "../dictionaries/holidays.js";
import { floatingHolidaysDates } from "../dictionaries/floatingHolidaysDates.js";
import { daysExchanges } from "../dictionaries/daysExchanges.js";

export class YearVersion {
  constructor(year, country, language) {
    this.setYear(year);
    this.country = country;
    this.language = language;
    if (this.country) {
      this.localize(this.country);
    }
    if (this.language) {
      this.translate(this.language);
    }
  }

  setYear(year) {
    this.year = year;
    return this;
  }

  translate(language) {
    this.language = language ? language : null;
    document.documentElement.setAttribute("lang", language);
    for (let day of this.year.days) {
      const month = day.month;
      day.monthName = months[month - 1][this.language];
      const weekday = day.weekday;
      day.weekdayNameShort =
        weekdays[weekday]["translate"][this.language]["short"];
      day.weekdayNameLong =
        weekdays[weekday]["translate"][this.language]["long"];
    }
    if (this.specialDays) {
      for (let specialDay in this.specialDays) {
        const day = this.year.yearDatesMap.get(
          `${this.year.yearNum}-${specialDay}`,
        );
        day.holiday = this.specialDays[specialDay][this.language];
      }
    }
    return this;
  }

  localize(country) {
    this.country = country;
    //Distinguish working and non-working days
    for (let day of this.year.days) {
      day.working = weekdays[day.weekday].working;
    }
    const holidaysItems = holidays[country];
    //Merge steady holidays with floating this year holidays
    if (floatingHolidaysDates[country]) {
      const holidaysFloats = floatingHolidaysDates[country];
      for (let key in holidaysFloats) {
        if (holidaysItems.hasOwnProperty(key)) {
          if (holidaysFloats[key][this.year.yearNum]) {
            const newKey = holidaysFloats[key][this.year.yearNum];
            holidaysItems[newKey] = holidaysItems[key];
          }
          delete holidaysItems[key];
        }
      }
    }
    //Make holidays non-working days
    for (let date in holidaysItems) {
      const day = this.year.yearDatesMap.get(`${this.year.yearNum}-${date}`);
      day.working = false;
    }
    //Handle other special days types changes
    if (daysExchanges[country]) {
      const exchangeFrom = {};
      const exchangeTo = {};
      const workDaysMask = daysExchanges[country].working;
      const daysNames = daysExchanges[country].translate;
      const changes = daysExchanges[country].dates[this.year.yearNum];
      if (changes) {
        for (let change of changes) {
          exchangeFrom[change["from"]] = daysNames["from"];
          exchangeTo[change["to"]] = daysNames["to"];
        }
        for (let item of changes) {
          const fromDay = this.year.yearDatesMap.get(
            `${this.year.yearNum}-${item.from}`,
          );
          const toDay = this.year.yearDatesMap.get(
            `${this.year.yearNum}-${item.to}`,
          );
          fromDay.working = workDaysMask.from;
          toDay.working = workDaysMask.to;
        }
        //Gather all the special days in one object
        this.specialDays = { ...holidaysItems, ...exchangeFrom, ...exchangeTo };
      } else {
        this.specialDays = holidaysItems;
      }
    }
    return this;
  }
}
