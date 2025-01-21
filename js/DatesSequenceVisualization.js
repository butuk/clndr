import { createElement } from "./helpFunctions.js";

export class DatesSequenceVisualization {
  constructor(object, startDay) {
    this.wheelDelta = 0;
    this.currentSlideIndex = 0;
    this.isMoving = false;
    this.clientStartX = 0;
    this.clientCurrentX = 0;
    this.currentX = 0;
    this.previousX = 0;
    this.animationID = 0;
    this.object = object;
    this.yearMap = this.object.year.yearDatesMap;
    this.yearNum = this.object.year.yearNum;
    this.initialDay = startDay
      ? this.yearMap.get(startDay)
      : this.yearMap.get(`${this.yearNum}-1-1`);

    this.handleWheel = this.handleWheel.bind(this);
    // this.handleWheelEvent = this.handleWheelEvent.bind(this);
    this.handleInteractionStart = this.handleInteractionStart.bind(this);
    this.handleInteractionInProcess =
      this.handleInteractionInProcess.bind(this);
    this.handleInteractionEnd = this.handleInteractionEnd.bind(this);
    this.animation = this.animation.bind(this);
    this.interactionEvent = this.interactionEvent.bind(this);

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
    this.slides = createElement("div", "day-slides");

    if (initialDay.previous) {
      this.previousDay = this.getDayByKey(initialDay.previous);
      const previous = this.createSlide(this.previousDay);
      this.slides.append(previous);
    } else {
      this.slides.classList.add("day-slides_beginning");
    }
    this.currentDay = this.getDayByKey(initialDay);
    const current = this.createSlide(this.currentDay);
    this.slides.append(current);
    if (initialDay.next) {
      this.nextDay = this.getDayByKey(initialDay.next);
      const next = this.createSlide(this.nextDay);
      this.slides.append(next);
    } else {
      this.slides.classList.add("day-slides_end");
    }
    slider.append(this.slides);
    document.body.append(slider);

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
    this.slides.addEventListener("touchstart", (event) => {
      this.handleInteractionStart(event);
    });
    this.slides.addEventListener("touchmove", this.handleInteractionInProcess);
    this.slides.addEventListener("touchend", this.handleInteractionEnd);

    // On wheel event
    this.slides.addEventListener("wheel", this.handleWheel, {
      passive: false,
    });
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

  handleWheel(event) {
    event.preventDefault();
    if (!this.isScrolling) {
      this.handleInteractionStart(event);
    }
    this.handleInteractionInProcess(event);

    clearTimeout(this.isScrolling);
    this.isScrolling = setTimeout(() => {
      this.wheelDelta = 0;
      this.handleInteractionEnd(event);
      this.isScrolling = false;
    }, 100);
  }

  /*handleWheelEvent(event) {
    event.preventDefault();
    if (this.isMoving) {
      return;
    }

    const deltaY = event.deltaY;
    const deltaX = event.deltaX;

    if (deltaX > 0 || deltaY < 0) {
      this.isMoving = true;
      this.currentSlideIndex = 1;
    } else if (deltaX < 0 || deltaY > 0) {
      this.isMoving = true;
      this.currentSlideIndex = -1;
    }

    this.switchTransitionOn();
    this.setSliderFinalPosition();
    this.setSliderPosition();
  }*/

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

  switchTransitionOn(condition = true) {
    this.slides.style.transition = condition ? this.transition : "none";
  }

  handleInteractionStart(event) {
    this.switchTransitionOn(false);
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
    clearTimeout(this.isScrolling);
    this.slides.addEventListener("transitionend", () => {
      if (this.currentSlideIndex === 1) {
        this.create(this.nextDay);
      } else if (this.currentSlideIndex === -1) {
        this.create(this.previousDay);
      } else {
        this.create(this.currentDay);
      }
      this.currentSlideIndex = 0;
      this.previousX = 0;
      this.currentX = 0;
      this.isMoving = false;
    });
  }
}
