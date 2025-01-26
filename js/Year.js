import { Day } from "./Day.js";
import { intToRoman, createDayFinder } from "./helpFunctions.js";
import { weekdays } from "../dictionaries/weekdays.js";
import { months } from "../dictionaries/months.js";
import { holidays } from "../dictionaries/holidays.js";
import { floatingHolidaysDates } from "../dictionaries/floatingHolidaysDates.js";
import { daysExchanges } from "../dictionaries/daysExchanges.js";

export class Year {
  constructor(settings) {
    this.settings = settings;
    this.number = settings.year ? settings.year : new Date().getFullYear();

    // Days of the year
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
    // Day finder
    this.dayFinder = createDayFinder(this.number, this.days);

    this.country = settings.country ? settings.country : null;
    this.language = settings.language ? settings.language : null;

    // Subscribe to language changes
    this.settings.onLanguageChange((event) => {
      const { language } = event.detail;
      this.updateLanguage(language);
    });

    // Subscribe to country changes
    this.settings.onCountryChange((event) => {
      const { country } = event.detail;
      this.updateCountry(country);
    });
  }

  set number(value) {
    this._number = value;
    return this;
  }

  get number() {
    return this._number;
  }

  set country(value) {
    this._country = value;
    //Distinguish working and non-working days
    for (let day of this.days) {
      day.working = weekdays[day.weekday].working;
    }
    const holidaysItems = holidays[this._country];
    //Merge steady holidays with floating this year holidays
    if (floatingHolidaysDates[this._country]) {
      const holidaysFloats = floatingHolidaysDates[this._country];
      for (let key in holidaysFloats) {
        if (holidaysItems.hasOwnProperty(key)) {
          if (holidaysFloats[key][this.number]) {
            const newKey = holidaysFloats[key][this.number];
            holidaysItems[newKey] = holidaysItems[key];
          }
          delete holidaysItems[key];
        }
      }
    }
    //Make holidays non-working days
    for (let date in holidaysItems) {
      const day = this.dayFinder.get(`${this.number}-${date}`);
      day.working = false;
    }
    //Handle other special days types changes
    if (daysExchanges[this._country]) {
      const exchangeFrom = {};
      const exchangeTo = {};
      const workDaysMask = daysExchanges[this._country].working;
      const daysNames = daysExchanges[this._country].translate;
      const changes = daysExchanges[this._country].dates[this.number];
      if (changes) {
        for (let change of changes) {
          exchangeFrom[change["from"]] = daysNames["from"];
          exchangeTo[change["to"]] = daysNames["to"];
        }
        for (let item of changes) {
          const fromDay = this.dayFinder.get(`${this.number}-${item.from}`);
          const toDay = this.dayFinder.get(`${this.number}-${item.to}`);
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

  get country() {
    return this._country;
  }

  set language(value) {
    this._language = value;
    document.documentElement.setAttribute("lang", this._language);
    for (let day of this.days) {
      const month = day.month;
      const weekday = day.weekday;
      day.monthName = this._language ? months[month - 1][this._language] : null;
      day.weekdayNameShort = weekdays[weekday]["translate"][this._language]
        ? weekdays[weekday]["translate"][this._language]["short"]
        : null;
      day.weekdayNameLong = weekdays[weekday]["translate"][this._language]
        ? weekdays[weekday]["translate"][this._language]["long"]
        : null;
    }
    if (this.specialDays) {
      for (let specialDay in this.specialDays) {
        const day = this.dayFinder.get(`${this.number}-${specialDay}`);
        day.holiday = this._language
          ? this.specialDays[specialDay][this._language]
          : null;
      }
    }
    return this;
  }

  get language() {
    return this._language;
  }

  updateLanguage(language) {
    console.log(`Calendar: Language: ${language}`);
    this.language = language;
  }

  updateCountry(country) {
    console.log(`Calendar: Country: ${country}`);
    this.country = country;
  }
}
