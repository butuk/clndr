import { Year } from "./Year.js";

export class Data {
  years: Array<Year>;
  constructor(num: number) {
    const year = new Year(num);
    this.years = [];
    this.years.push(year);
  }

  /*

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
    const day = this.find(`${this.number}-${date}`);
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
        const fromDay = this.find(`${this.number}-${item.from}`);
        const toDay = this.find(`${this.number}-${item.to}`);
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
      const day = this.find(`${this.number}-${specialDay}`);
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

*/
}
