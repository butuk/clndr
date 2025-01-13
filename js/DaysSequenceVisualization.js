import { createElement } from "./helpFunctions.js";

export class DaysSequenceVisualization {
  constructor(object, initialDay) {
    this.object = object;
    this.yearMap = this.object.year.yearDatesMap;
    this.yearNum = this.object.year.yearNum;

    this.initialDay = initialDay
      ? initialDay
      : this.yearMap.get(`${this.yearNum}-1-1`);
    console.log(this.initialDay);
    this.create(this.initialDay);
  }

  create(initialDay) {
    let daySlider = document.querySelector(".day-slider");

    if (daySlider) {
      daySlider.remove();
    }

    const dayInfo = this.yearMap.get(
      `${this.yearNum}-${this.initialDay.month}-${this.initialDay.date}`,
    );
    daySlider = createElement("section", "day-slider");
    const daySlides = createElement("div", "day-slides");
    // Temporary solution: create 3 calendar-slides with the same day
    for (let i = 0; i < 3; i++) {
      const day = this.createSlide(dayInfo);
      daySlides.append(day);
    }
    //---------
    daySlider.append(daySlides);

    document.body.append(daySlider);
  }

  createSlide(dayInfo) {
    const dayElement = createElement("div", "day");
    const weekday = createElement("div", "day-text_small");
    const date = createElement("div", "day-text");
    dayElement.append(weekday);
    dayElement.append(date);
    if (dayInfo.working) {
      dayElement.classList.add("day_working");
    } else {
      dayElement.classList.add("day_special");
    }
    if (dayInfo.weekdayNameLong) {
      weekday.innerHTML = `${dayInfo.weekdayNameLong}`;
    }
    date.innerHTML = `${dayInfo.date}.${dayInfo.month}`;
    return dayElement;
  }

  /*remove(e, daySlider) {
    daySlider.classList.add("day-slider-closed");
    daySlider.addEventListener("transitionend", () => {
      daySlider.style.opacity = "";
      daySlider.style.scale = "";
      daySlider.style.transform = "";
      daySlider.removeEventListener("transitionend", () => {});
      daySlider.remove();
      const closeBut = e.target;
      closeBut.remove();
    });
  }*/
}
