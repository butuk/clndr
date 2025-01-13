import { createElement } from "./helpFunctions.js";

export class DaysSequenceVisualization {
  constructor(initialDay, object) {
    this.object = object;
    this.yearMap = this.object.year.yearDatesMap;
    this.yearNum = this.object.year.yearNum;
    this.create(initialDay);
  }

  create(initialDay) {
    if (initialDay) {
      this.cellSliderStart = initialDay;
    }
    let cellSlider = document.querySelector(".cell-slider");
    let closeBut = document.querySelector(".close-button");
    if (cellSlider) {
      cellSlider.remove();
    }
    if (closeBut) {
      closeBut.remove();
    }

    closeBut = createElement("div", "close-button");

    const dayInfo = this.yearMap.get(
      `${this.yearNum}-${this.cellSliderStart.month}-${this.cellSliderStart.date}`,
    );
    cellSlider = createElement("section", "cell-slider");
    const cellSlides = createElement("div", "cell-slides");
    // Temporary solution: create 3 slides with the same day
    for (let i = 0; i < 3; i++) {
      const day = this.createSlide(dayInfo);
      cellSlides.append(day);
    }
    //---------
    cellSlider.append(cellSlides);
    document.body.append(closeBut);
    document.body.append(cellSlider);

    closeBut.addEventListener("click", (e) => this.remove(e, cellSlider));
  }

  createSlide(dayInfo) {
    const dayElement = createElement("div", "day");
    const weekday = createElement("div", "cell-text_small");
    const date = createElement("div", "cell-text");
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

  remove(e, cellSlider) {
    cellSlider.classList.add("cell-slider-closed");
    cellSlider.addEventListener("transitionend", () => {
      cellSlider.style.opacity = "";
      cellSlider.style.scale = "";
      cellSlider.style.transform = "";
      cellSlider.removeEventListener("transitionend", () => {});
      cellSlider.remove();
      const closeBut = event.target;
      closeBut.remove();
    });
  }
}
