import { months } from "../dictionaries/months.js";
import { createElement, intToRoman } from "./helpFunctions.js";
import { DaysSequenceVisualization } from "./DaysSequenceVisualization.js";

export class YearVisualization {
  constructor(object, block) {
    this.block = block;
    this.controlNumber = 27; // Cell's smallest side size
    const today = new Date();
    this.currentMonth = today.getMonth() + 1;
    this.currentDate = today.getDate();
    this.currentYear = today.getFullYear();
    this.delta = 3;
    this.isDragging = false;
    this.yearNum = object.year.yearNum;

    this.handleMouseGrab = this.handleMouseGrab.bind(this);
    this.handleMouseTouchMove = this.handleMouseTouchMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchGrabCalendar = this.handleTouchGrabCalendar.bind(this);
    this.handleCalendarClick = this.handleCalendarClick.bind(this);
    //this.createCellSlider = this.createCellSlider.bind(this);
    this.removeCalendarEventListeners =
      this.removeCalendarEventListeners.bind(this);
    this.addCalendarEventListeners = this.addCalendarEventListeners.bind(this);
    this.zoomCalendarFromPoint = this.zoomCalendarFromPoint.bind(this);
    //this.createCellSlide = this.createCellSlide.bind(this);

    this.render(object);
    /*window.addEventListener("resize", () => {
      this.render(object);
    });*/
    this.addCalendarEventListeners();
    return this;
  }

  render(object) {
    this.object = object;

    this.content = document.querySelector(`.${this.block}`);
    this.slider = createElement("section", "slider");
    this.slides = createElement("div", "slides");

    const oldVisualization = document.querySelectorAll(".slide");
    for (let slide of oldVisualization) {
      if (slide) {
        slide.remove();
      }
    }

    //Calendar visualization
    for (let i = 0; i < 3; i++) {
      const slide = createElement("div", "slide");
      //Creating table header
      let step = 1;
      if (window.innerWidth / 32 < this.controlNumber) {
        step = 2;
      }
      for (let columnNum = 2; columnNum <= 32; columnNum += step) {
        this.renderColumnHR(columnNum, slide);
      }
      //Creating months names
      for (let rowNum = 0; rowNum < 12; rowNum++) {
        this.renderRowHR(rowNum, slide);
      }
      //Creating table body
      for (let day of this.object.year.days) {
        this.renderTheDay(day, slide);
      }
      this.slides.append(slide);
    }
    this.slider.append(this.slides);
    this.content.append(this.slider);

    //Check screen and visualization proportion and set condition of mobile behavior
    const cell = document.querySelector(".cell");
    const cellWidth = cell.getBoundingClientRect().width;
    const cellHeight = cell.getBoundingClientRect().height;
    //console.log(cellWidth, cellHeight, Math.min(cellWidth, cellHeight));
    this.condition = Math.min(cellWidth, cellHeight) < this.controlNumber;

    //Center the visualization
    this.centerVisualization(this.object.year.yearNum, this.block);
    return this;
  }

  renderTheDay(day, where) {
    const cell = createElement("div", "cell");
    cell.style.gridRow = day.month + 2;
    cell.style.gridColumn = day.date + 1;
    cell.style.top = `${this.delta * day.date}%`;

    let dayMark;
    if (day.working) {
      dayMark = createElement("div", "working-day");
    } else {
      dayMark = createElement("div", "special-day");
    }

    cell.dataset.month = day.month;
    cell.dataset.date = day.date;

    //cell.dataset.color = window.getComputedStyle(dayMark).color;
    if (day.weekdayNameShort) {
      cell.dataset.weekday = day.weekdayNameShort;
    }
    if (
      day.month === this.currentMonth &&
      day.date === this.currentDate &&
      day.year === this.currentYear
    ) {
      dayMark.classList.add("current-date");
    }
    cell.append(dayMark);
    where.append(cell);
    return this;
  }

  renderColumnHR(columnNum, where) {
    const hr = createElement("div", "hr");
    hr.style.gridRow = "1";
    hr.style.gridColumn = `${columnNum}`;
    hr.textContent = `${columnNum - 1}`;
    hr.style.top = `${this.delta * columnNum + 50}%`;
    where.append(hr);
    return this;
  }

  renderRowHR(rowNum, where) {
    const monthName = createElement("div", "hr");
    monthName.style.gridColumn = "1";
    monthName.style.gridRow = `${rowNum + 3}`;
    if (this.object.language) {
      monthName.textContent = months[rowNum][this.object.language]
        .charAt(0)
        .toUpperCase();
    } else {
      monthName.textContent = intToRoman(rowNum + 1);
    }
    where.append(monthName);
    return this;
  }

  centerVisualization(year, block) {
    const chosenYear = year;
    const centerX = document.documentElement.clientWidth / 2;
    const currentDay = document.querySelectorAll(".current-date")[1];
    const slidesX = this.slides.getBoundingClientRect().left;
    const dayWidth = document
      .querySelector(".working-day")
      .parentElement.getBoundingClientRect().width;
    if (block) {
      if (currentDay) {
        const dayX = currentDay.getBoundingClientRect().left;
        const delta = centerX - dayX;
        this.slides.style.left = slidesX + delta + "px";
      } else {
        this.slides.style.left =
          chosenYear % 4 === 0
            ? slidesX + dayWidth * 3 + "px"
            : slidesX + dayWidth * 4 + "px";
      }
    }
    return this;
  }

  addCalendarEventListeners() {
    // Scrolling
    document.addEventListener("wheel", this.handleWheelEvent, {
      passive: false,
    });

    // Grabbing the slides
    document.addEventListener("mousedown", this.handleMouseGrab);
    document.addEventListener("touchstart", this.handleTouchGrabCalendar);

    // Days on hover
    if (!this.condition) {
      this.slides.addEventListener("mouseover", this.handleDayHover);
      this.slides.addEventListener("mouseout", this.handleDayMouseOut);
    }

    // Click on mobile
    if (this.condition) {
      document.addEventListener("click", this.handleCalendarClick);
    }

    return this;
  }

  removeCalendarEventListeners() {
    document.removeEventListener("wheel", this.handleWheelEvent);
    document.removeEventListener("mousedown", this.handleMouseGrab);
    document.removeEventListener("touchstart", this.handleTouchGrabCalendar);
    this.slides.removeEventListener("mouseover", this.handleDayHover);
    this.slides.removeEventListener("mouseout", this.handleDayMouseOut);
    document.removeEventListener("click", this.handleCalendarClick);
  }

  handleWheelEvent(event) {
    const slides = document.querySelector(".slides");
    const window = document.documentElement.clientWidth;
    const deltaY = event.deltaY;
    const deltaX = event.deltaX;
    let left = slides.getBoundingClientRect().left;

    let leftBorder = -2 * window;
    if (
      slides.getBoundingClientRect().left < leftBorder ||
      slides.getBoundingClientRect().left > 0
    ) {
      slides.style.left = -window + "px";
      left = slides.getBoundingClientRect().left;
    }

    if (deltaY > 0) {
      slides.style.left = left + deltaY + "px";
    } else if (deltaY < 0) {
      slides.style.left = left + deltaY + "px";
    }

    if (deltaX < 0) {
      slides.style.left = left - deltaX + "px";
    } else if (deltaX > 0) {
      slides.style.left = left - deltaX + "px";
    }

    event.preventDefault();
  }

  handleTouchGrabCalendar(event) {
    const slides = document.querySelector(".slides");
    this.isDragging = true;

    const clientX = event.touches[0].clientX;

    this.offsetX = clientX + Math.abs(slides.getBoundingClientRect().left);

    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  handleMouseGrab(event) {
    const slides = document.querySelector(".slides");
    this.isDragging = true;

    this.offsetX =
      event.clientX + Math.abs(slides.getBoundingClientRect().left);

    document.addEventListener("mousemove", this.handleMouseTouchMove);
    document.addEventListener("mouseup", this.handleTouchEnd);

    document.body.style.cursor = "grabbing";
  }

  handleTouchMove(event) {
    const window = document.documentElement.clientWidth;
    const slides = document.querySelector(".slides");

    if (this.isDragging) {
      let clientX = event.touches[0].clientX;
      let left = clientX - this.offsetX;
      let leftBorder = -2 * window;
      if (
        slides.getBoundingClientRect().left < leftBorder ||
        slides.getBoundingClientRect().left > 0
      ) {
        slides.style.left = window + "px";
        this.offsetX =
          event.touches[0].clientX +
          Math.abs(slides.getBoundingClientRect().left);
      }
      slides.style.left = left + "px";
    }
  }

  handleMouseTouchMove(event) {
    const window = document.documentElement.clientWidth;
    const slides = document.querySelector(".slides");

    if (this.isDragging) {
      let clientX = event.clientX || event.touches[0].clientX;
      let left = clientX - this.offsetX;
      let leftBorder = -2 * window;
      if (
        slides.getBoundingClientRect().left < leftBorder ||
        slides.getBoundingClientRect().left > 0
      ) {
        slides.style.left = window + "px";
        this.offsetX =
          event.clientX + Math.abs(slides.getBoundingClientRect().left);
      }
      slides.style.left = left + "px";
    }
  }

  handleTouchEnd() {
    this.isDragging = false;
    document.body.style.cursor = "grab";
  }

  handleDayMouseOut(event) {
    const text = document.querySelector(".cell-text");
    const parent = text && text.parentElement ? text.parentElement : null;
    if (parent) {
      parent.removeChild(text);
    }
    const target = event.target.closest(".cell");
    const firstChild = target ? target.children[0] : null;
    if (firstChild) {
      firstChild.classList.remove("day_hover");
    }
  }

  handleDayHover(event) {
    const target = event.target.closest(".cell");
    const firstChild = target ? target.children[0] : null;
    if (firstChild) {
      firstChild.classList.add("day_hover");

      const date = firstChild.parentElement.dataset.date;
      const month = firstChild.parentElement.dataset.month;
      const weekday = firstChild.parentElement.dataset.weekday;

      let message;
      if (typeof weekday !== "undefined") {
        message = `${weekday}<br>${date}.${month}`;
      } else {
        message = `${date}.${month}`;
      }
      const text = document.createElement("div");
      text.classList.add("cell-text");
      text.innerHTML = message;
      firstChild.append(text);
    }
  }

  handleCalendarClick(event) {
    const clickedCell = event.target.closest(".cell");
    if (clickedCell) {
      const startPoint = this.zoomCalendarFromPoint(clickedCell);
      this.slider.addEventListener("transitionend", () => {
        this.slider.style.display = "none";
        this.removeCalendarEventListeners();
        new DaysSequenceVisualization(startPoint, this.object);
      });
    }
  }

  zoomCalendarFromPoint(triggeredCell) {
    const dayNeeded = triggeredCell.children[0];
    const dayWidth = dayNeeded.getBoundingClientRect().width;
    const dayHeight = dayNeeded.getBoundingClientRect().height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = screenWidth / dayWidth;
    const screenCenterX = screenWidth / 2;
    const screenCenterY = screenHeight / 2;
    const dayCenterX =
      dayNeeded.getBoundingClientRect().left +
      dayNeeded.getBoundingClientRect().width / 2;
    const dayCenterY =
      dayNeeded.getBoundingClientRect().top +
      dayNeeded.getBoundingClientRect().height / 2;
    const xNeeded =
      (this.slider.getBoundingClientRect().left + screenCenterX - dayCenterX) *
      scale;
    const persentFromTop = (
      (this.slider.getBoundingClientRect().top + dayHeight / 2) /
      screenHeight /
      2
    ).toFixed(5);
    const yNeeded =
      (this.slider.getBoundingClientRect().top +
        screenCenterY -
        dayCenterY -
        screenHeight * persentFromTop) *
      scale;
    this.slider.style.transform = `translate(${xNeeded}px, ${yNeeded}px) scale(${scale}) `;
    this.slider.style.transition = "all .15s ease-in-out";
    return triggeredCell.dataset;
  }

  /*createCellSlider(initialDay) {
    if (initialDay) {
      this.cellSliderStart = initialDay;
    }
    this.cellSliderOpen = true;
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
      const day = this.createCellSlide(dayInfo);
      cellSlides.append(day);
    }
    //---------
    cellSlider.append(cellSlides);
    document.body.append(closeBut);
    document.body.append(cellSlider);

    closeBut.addEventListener("click", (e) =>
      this.removeCellSlider(e, cellSlider),
    );
  }

  createCellSlide(dayInfo) {
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

  removeCellSlider(event, cellSlider) {
    //Temporary solution: without calendar slider animation
    this.cellSliderOpen = false;
    cellSlider.classList.add("cell-slider-closed");
    cellSlider.addEventListener("transitionend", () => {
      cellSlider.style.opacity = "";
      cellSlider.style.scale = "";
      cellSlider.style.transform = "";
      cellSlider.removeEventListener("transitionend", () => {});
      cellSlider.remove();
      const closeBut = event.target;
      closeBut.remove();
      this.slider.style.transform = "";
      this.slider.style.scale = "";
      this.slider.style.display = "block";
      this.slider.removeEventListener("transitionend", () => {});
      this.addCalendarEventListeners();
    });
  }*/
}
