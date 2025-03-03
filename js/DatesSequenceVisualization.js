import { createElement } from "./helpFunctions.js";

export class DatesSequenceVisualization {
  constructor(year, startDay) {
    this.year = year;
    this.wheelDelta = 0;
    this.currentSlideIndex = 0;
    this.isMoving = false;
    this.clientStartX = 0;
    this.clientCurrentX = 0;
    this.currentX = 0;
    this.previousX = 0;
    this.animationID = 0;
    this.number = this.year.number;
    this.currentDay = startDay
      ? this.year.find(`${this.number}-${startDay}`)
      : this.year.find(`${this.number}-1-1`);

    this.handleInteractionStart = this.handleInteractionStart.bind(this);
    this.handleInteractionInProcess =
      this.handleInteractionInProcess.bind(this);
    this.handleInteractionEnd = this.handleInteractionEnd.bind(this);
    this.animation = this.animation.bind(this);
    this.interactionEvent = this.interactionEvent.bind(this);

    this.render();
  }

  render() {
    this.slider = document.querySelector(".day-slider")
      ? document.querySelector(".day-slider")
      : createElement("section", "day-slider");

    const oldVisualization = document.querySelector(".day-slides");
    if (oldVisualization) {
      oldVisualization.remove();
    }
    this.slides = createElement("div", "day-slides");

    if (this.currentDay.previous) {
      this.previousDay = this.getDayByKey(this.currentDay.previous);
      const previous = this.createSlide(this.previousDay);
      this.slides.append(previous);
    } else {
      this.slides.classList.add("day-slides_beginning");
    }
    const current = this.createSlide(this.currentDay);
    this.slides.append(current);
    if (this.currentDay.next) {
      this.nextDay = this.getDayByKey(this.currentDay.next);
      const next = this.createSlide(this.nextDay);
      this.slides.append(next);
    } else {
      this.slides.classList.add("day-slides_end");
    }
    this.slider.append(this.slides);
    document.body.append(this.slider);

    this.transition = window
      .getComputedStyle(this.slides)
      .getPropertyValue("transition");

    // On mouse events
    this.slides.addEventListener("mousedown", (event) => {
      this.handleInteractionStart(event, this.currentSlideIndex);
    });
    this.slides.addEventListener("mousemove", this.handleInteractionInProcess);
    this.slides.addEventListener("mouseup", this.handleInteractionEnd);
    this.slides.addEventListener("mouseleave", this.handleInteractionEnd);

    // On touch events
    this.slides.addEventListener(
      "touchstart",
      (event) => {
        this.handleInteractionStart(event);
      },
      { passive: true },
    );
    this.slides.addEventListener("touchmove", this.handleInteractionInProcess, {
      passive: true,
    });
    this.slides.addEventListener("touchend", this.handleInteractionEnd);
  }

  getDayByKey(day) {
    return this.year.find(`${this.number}-${day.month}-${day.date}`);
  }

  createSlide(dayInfo) {
    const dayElement = createElement("div", "day");
    const weekday = createElement("div", "day-text_small");
    const date = createElement("div", "day-text_big");
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

  getEventX(event) {
    if (event.type.includes("mouse")) {
      return event.pageX;
    } else if (event.type.includes("touch")) {
      return event.touches[0].clientX;
    } else {
      this.wheelDelta += event.wheelDelta;
      if (this.wheelDelta > window.innerWidth) {
        return (this.wheelDelta = window.innerWidth);
      } else if (this.wheelDelta < -window.innerWidth) {
        return (this.wheelDelta = -window.innerWidth);
      } else {
        return this.wheelDelta;
      }
    }
  }

  handleInteractionStart(event) {
    return this.interactionEvent(event);
  }

  handleInteractionInProcess(event) {
    if (this.isMoving) {
      this.clientCurrentX = this.getEventX(event);
      const deltaX = this.clientStartX - this.clientCurrentX;
      this.currentX = this.previousX - deltaX;
    }
  }

  interactionEvent(event) {
    this.isMoving = true;
    this.clientStartX = this.getEventX(event);
    this.animationID = requestAnimationFrame(this.animation);
    document.body.style.cursor = "grabbing";
  }

  handleInteractionEnd() {
    this.isMoving = false;
    cancelAnimationFrame(this.animationID);
    const movedBy = this.currentX - this.previousX;
    if (movedBy < -50 && !this.slides.classList.contains("day-slides_end")) {
      this.currentSlideIndex = 1;
    }
    if (
      movedBy > 50 &&
      !this.slides.classList.contains("day-slides_beginning")
    ) {
      this.currentSlideIndex = -1;
    }
    this.slides.style.transition = this.transition;
    this.setSliderFinalPosition();
    document.body.style.cursor = "grab";
  }

  animation() {
    this.setSliderPosition();
    if (this.isMoving) {
      requestAnimationFrame(this.animation);
    }
  }

  setSliderPosition() {
    this.slides.style.transform = `translateX(${this.currentX}px)`;
  }

  setSliderFinalPosition() {
    this.currentX = this.currentSlideIndex * -window.innerWidth;
    this.isMoving = false;
    const onPlace = () => {
      switch (this.currentSlideIndex) {
        case 1:
          this.currentDay = this.nextDay;
          break;
        case -1:
          this.currentDay = this.previousDay;
          break;
      }
      this.render();
      this.currentSlideIndex = 0;
      this.previousX = 0;
      this.currentX = 0;

      this.slides.removeEventListener("transitionend", onPlace);
    };

    this.slides.addEventListener("transitionend", onPlace);
  }
}
