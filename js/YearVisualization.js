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
    this.handleTouchGrab = this.handleTouchGrab.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.zoomFromPoint = this.zoomFromPoint.bind(this);

    this.render(object);
    this.centerVisualization(this.yearNum, this.block);
    this.addEventListeners();
    return this;
  }

  render(object) {
    this.object = object;
    this.content = document.querySelector(`.${this.block}`);
    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");
    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("div", "calendar-slides");

    const oldVisualization = document.querySelectorAll(".calendar-slide");
    for (let slide of oldVisualization) {
      if (slide) {
        slide.remove();
      }
    }

    //Calendar visualization
    for (let i = 0; i < 3; i++) {
      const slide = createElement("div", "calendar-slide");
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
    const cell = document.querySelector(".calendar-cell");
    const cellWidth = cell.getBoundingClientRect().width;
    const cellHeight = cell.getBoundingClientRect().height;
    this.condition = Math.min(cellWidth, cellHeight) < this.controlNumber;
    return this;
  }

  renderTheDay(day, where) {
    const cell = createElement("div", "calendar-cell");
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

    //calendar-cell.dataset.color = window.getComputedStyle(dayMark).color;
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
    const hr = createElement("div", "calendar-cell-hr");
    hr.style.gridRow = "1";
    hr.style.gridColumn = `${columnNum}`;
    hr.textContent = `${columnNum - 1}`;
    hr.style.top = `${this.delta * columnNum + 50}%`;
    where.append(hr);
    return this;
  }

  renderRowHR(rowNum, where) {
    const monthName = createElement("div", "calendar-cell-hr");
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

  addEventListeners() {
    // Scrolling
    document.addEventListener("wheel", this.handleWheelEvent, {
      passive: false,
    });

    // Grabbing the calendar-slides
    document.addEventListener("mousedown", this.handleMouseGrab);
    document.addEventListener("touchstart", this.handleTouchGrab);

    // Days on hover
    if (!this.condition) {
      this.slides.addEventListener("mouseover", this.handleDayHover);
      this.slides.addEventListener("mouseout", this.handleDayMouseOut);
    }

    // Click on mobile
    /*if (this.condition) {
      document.addEventListener("click", this.handleClick);
    }*/

    return this;
  }

  removeEventListeners() {
    document.removeEventListener("wheel", this.handleWheelEvent);
    document.removeEventListener("mousedown", this.handleMouseGrab);
    document.removeEventListener("touchstart", this.handleTouchGrab);
    this.slides.removeEventListener("mouseover", this.handleDayHover);
    this.slides.removeEventListener("mouseout", this.handleDayMouseOut);
    document.removeEventListener("click", this.handleClick);
  }

  handleWheelEvent(event) {
    const slides = document.querySelector(".calendar-slides");
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

  handleTouchGrab(event) {
    const slides = document.querySelector(".calendar-slides");
    this.isDragging = true;

    const clientX = event.touches[0].clientX;

    this.offsetX = clientX + Math.abs(slides.getBoundingClientRect().left);

    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  handleMouseGrab(event) {
    const slides = document.querySelector(".calendar-slides");
    this.isDragging = true;

    this.offsetX =
      event.clientX + Math.abs(slides.getBoundingClientRect().left);

    document.addEventListener("mousemove", this.handleMouseTouchMove);
    document.addEventListener("mouseup", this.handleTouchEnd);

    document.body.style.cursor = "grabbing";
  }

  handleTouchMove(event) {
    const window = document.documentElement.clientWidth;
    const slides = document.querySelector(".calendar-slides");

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
    const slides = document.querySelector(".calendar-slides");

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
    const text = document.querySelector(".day-text");
    const parent = text && text.parentElement ? text.parentElement : null;
    if (parent) {
      parent.removeChild(text);
    }
    const target = event.target.closest(".calendar-cell");
    const firstChild = target ? target.children[0] : null;
    if (firstChild) {
      firstChild.classList.remove("day_hover");
    }
  }

  centerVisualization(year, block) {
    const chosenYear = year,
      centerX = document.documentElement.clientWidth / 2,
      currentDay = document.querySelectorAll(".current-date")[1],
      slidesX = this.slides.getBoundingClientRect().left,
      dayWidth = document
        .querySelector(".day")
        .parentElement.getBoundingClientRect().width;
    if (block) {
      if (currentDay) {
        const dayX = currentDay.getBoundingClientRect().left;
        const delta = centerX - dayX;
        this.slides.style.left = slidesX + delta + dayWidth / 2 + "px";
      } else {
        this.slides.style.left =
          chosenYear % 4 === 0
            ? slidesX + dayWidth * 3 + "px"
            : slidesX + dayWidth * 4 + "px";
      }
    }
  }

  handleDayHover(event) {
    const target = event.target.closest(".calendar-cell");
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
      text.classList.add("day-text");
      text.innerHTML = message;
      firstChild.append(text);
    }
  }

  handleClick(event) {
    const clickedCell = event.target.closest(".calendar-cell");
    if (clickedCell) {
      const startPoint = this.zoomFromPoint(clickedCell);
      this.slider.addEventListener("transitionend", () => {
        this.slider.style.display = "none";
        this.removeEventListeners();
        new DaysSequenceVisualization(startPoint, this.object);
      });
    }
  }

  zoomFromPoint(triggeredCell) {
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
}
