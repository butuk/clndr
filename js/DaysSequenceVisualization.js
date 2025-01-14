import { createElement } from "./helpFunctions.js";

export class DaysSequenceVisualization {
  constructor(object, initialDay) {
    this.isSliding = false;
    this.object = object;
    this.yearMap = this.object.year.yearDatesMap;
    this.yearNum = this.object.year.yearNum;
    this.initialDay = initialDay
      ? this.yearMap.get(initialDay)
      : this.yearMap.get(`${this.yearNum}-1-1`);

    this.handleWheelEvent = this.handleWheelEvent.bind(this);
    this.handleEndOfSlideTransition =
      this.handleEndOfSlideTransition.bind(this);

    this.create(this.initialDay);
  }

  create(initialDay) {
    const slider = document.querySelector(".day-slider")
      ? document.querySelector(".day-slider")
      : createElement("section", "day-slider");

    const oldVisualization = document.querySelector(".day-slides");
    if (oldVisualization) {
      oldVisualization.remove();
    }
    const slides = createElement("div", "day-slides");

    if (initialDay.previous) {
      this.previousDay = this.getDayByKey(initialDay.previous);
      const previous = this.createSlide(this.previousDay);
      slides.append(previous);
    } else {
      slides.classList.add("day-slides_beginning");
    }
    this.currentDay = this.getDayByKey(initialDay);
    const current = this.createSlide(this.currentDay);
    slides.append(current);
    if (initialDay.next) {
      this.nextDay = this.getDayByKey(initialDay.next);
      const next = this.createSlide(this.nextDay);
      slides.append(next);
    } else {
      slides.classList.add("day-slides_end");
    }
    slider.append(slides);
    document.body.append(slider);

    document.addEventListener("wheel", this.handleWheelEvent);
  }

  getDayByKey(day) {
    return this.yearMap.get(`${this.yearNum}-${day.month}-${day.date}`);
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

  handleWheelEvent(event) {
    if (this.isSliding) {
      return;
    }

    const deltaY = event.deltaY;
    const deltaX = event.deltaX;
    const slides = document.querySelector(".day-slides");

    // Moving to the previous day
    if (
      (deltaY < 0 || deltaX < 0) &&
      !slides.classList.contains("day-slides_beginning")
    ) {
      this.isSliding = true;
      this.moveSlides(slides, "right");
      slides.addEventListener("transitionend", () => {
        this.handleEndOfSlideTransition(this.previousDay);
      });
    }
    // Moving to the next day
    if (
      (deltaY > 0 || deltaX > 0) &&
      !slides.classList.contains("day-slides_end")
    ) {
      this.isSliding = true;
      this.moveSlides(slides, "left");
      slides.addEventListener("transitionend", () => {
        this.handleEndOfSlideTransition(this.nextDay);
      });
    }
  }

  moveSlides(element, direction) {
    element.classList.add(`day-slides_to-${direction}`);
  }

  handleEndOfSlideTransition(dayTo) {
    this.isSliding = false;
    this.create(dayTo);
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
