import { createElement, intToRoman } from "./helpFunctions.ts";
import { Settings } from "./Settings.ts";

export class Visualization {
  year: number;
  slider: HTMLElement | SVGElement | null;
  slides: HTMLElement | SVGElement | null;
  delta: number = 3;
  isDragging: boolean = false;
  offsetX: number = 0;

  constructor(container: HTMLElement, year?: number) {
    this.handleMouseGrab = this.handleMouseGrab.bind(this);
    this.handleMouseTouchMove = this.handleMouseTouchMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchGrab = this.handleTouchGrab.bind(this);
    this.handleWheelEvent = this.handleWheelEvent.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
    this.addListeners = this.addListeners.bind(this);

    this.year = year ? year : new Date().getFullYear();

    //"Window" for visible slide
    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");

    //Slides container
    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("section", "calendar-slides");

    //Slides
    for (let i: number = 0; i < 3; i++) {
      const slide: HTMLElement | SVGElement = createElement(
        "div",
        "calendar-slide",
      );

      //Creating month names
      for (let rowNum: number = 0; rowNum < 12; rowNum++) {
        this.renderRowHR(rowNum, slide);
      }

      //Creating day numbers
      for (let i: number = 2; i <= 32; i++) {
        this.renderColumnHR(i, slide);
      }

      //Building a year calendar
      let date = new Date(this.year, 0, 1); // January 1st

      while (date.getFullYear() === this.year) {
        const columnNum: number = date.getDate() + 1;
        const dayOfWeek: number = date.getDay();
        const cell: HTMLElement | SVGElement = createElement(
          "svg",
          "calendar-cell",
        );
        cell.setAttribute("data-date", date.toLocaleDateString("en-CA"));
        cell.style.gridRow = `${date.getMonth() + 2}`;
        cell.style.gridColumn = `${columnNum}`;
        cell.style.top = `${this.delta * columnNum}%`;
        cell.setAttribute("viewBox", "0 0 100 100");
        const day =
          dayOfWeek !== 0 && dayOfWeek !== 6
            ? createElement("circle", "working-day")
            : createElement("rect", "special-day");
        cell.append(day);
        slide.append(cell);
        date.setDate(date.getDate() + 1);
      }

      this.slides?.append(slide);
    }

    this.slider?.append(this.slides!);

    container.append(this.slider!);

    //Current date highlighting
    const currentDate = new Date();
    if (this.slides) {
      const find = this.slides.querySelectorAll(
        `[data-date="${currentDate.toLocaleDateString("en-CA")}"]`,
      );

      find.forEach((e: Element): void => {
        let outline: HTMLElement | SVGElement = createElement(
          "circle",
          "current-date",
        );
        e.append(outline);
      });
    }

    //Centering visualization
    this.centerVisualization();

    //Add event listeners
    this.addListeners();
  }

  //Date name
  renderColumnHR(
    columnNum: number,
    where: HTMLElement | SVGElement,
  ): Visualization {
    if (columnNum < 1 || columnNum > 32) {
      throw new Error("Number for non-existing column");
    }
    const hr: HTMLElement | SVGElement = createElement(
      "div",
      "calendar-cell-hr",
    );
    hr.style.gridRow = "1";
    hr.style.gridColumn = `${columnNum}`;
    hr.textContent = `${columnNum - 1}`;
    hr.style.top = `${this.delta * columnNum}%`;
    where.append(hr);
    return this;
  }

  //Month names
  renderRowHR(rowNum: number, where: HTMLElement | SVGElement): Visualization {
    const monthName: HTMLElement | SVGElement = createElement(
      "div",
      "calendar-cell-hr",
    );
    monthName.style.gridColumn = "1";
    monthName.style.gridRow = `${rowNum + 2}`;

    monthName.textContent = intToRoman(rowNum + 1);

    where.append(monthName);

    return this;
  }

  centerVisualization(): void {
    if (this.slides) {
      const oneCell: Element | null =
        this.slides.querySelector(".calendar-cell");
      const centerX: number = document.documentElement.clientWidth / 2,
        currentDay: Element = document.querySelectorAll(".current-date")[1],
        slidesX: number = this.slides.getBoundingClientRect().left,
        dayWidth: number | null = oneCell
          ? oneCell.getBoundingClientRect().width
          : null;

      if (currentDay && dayWidth !== null) {
        const dayX = currentDay.getBoundingClientRect().left;
        const delta = centerX - dayX;
        this.slides.style.left = slidesX + delta + "px";
      } else if (dayWidth !== null) {
        this.slides.style.left =
          this.year % 4 === 0
            ? slidesX + dayWidth * 3 + "px"
            : slidesX + dayWidth * 4 + "px";
      } else return;
    }
  }

  addListeners(): void {
    // Scrolling
    document.addEventListener("wheel", this.handleWheelEvent, {
      passive: false,
    });

    // Grabbing the calendar-slides
    document.addEventListener("mousedown", this.handleMouseGrab);
    document.addEventListener("touchstart", this.handleTouchGrab);
    /*
            // Days on hover
            if (!this.condition) {
              this.slides.addEventListener("mouseover", this.handleDayHover);
              this.slides.addEventListener("mouseout", this.handleDayMouseOut);
            }

            // Click on mobile
            if (this.condition) {
              document.addEventListener("click", this.handleClick);
            }*/
  }

  removeEventListeners(): void {
    document.removeEventListener("wheel", this.handleWheelEvent);
    document.removeEventListener("mousedown", this.handleMouseGrab);
    document.removeEventListener("touchstart", this.handleTouchGrab);
    // this.slides.removeEventListener("mouseover", this.handleDayHover);
    // this.slides.removeEventListener("mouseout", this.handleDayMouseOut);
  }

  handleWheelEvent(event: WheelEvent): void {
    const window: number = document.documentElement.clientWidth,
      deltaY: number = event.deltaY,
      deltaX: number = event.deltaX;

    if (this.slides) {
      let left: number = this.slides.getBoundingClientRect().left;

      let leftBorder = -2 * window;
      if (
        this.slides.getBoundingClientRect().left < leftBorder ||
        this.slides.getBoundingClientRect().left > 0
      ) {
        this.slides.style.left = -window + "px";
        left = this.slides.getBoundingClientRect().left;
      }

      if (deltaY > 0) {
        this.slides.style.left = left + deltaY + "px";
      } else if (deltaY < 0) {
        this.slides.style.left = left + deltaY + "px";
      }

      if (deltaX < 0) {
        this.slides.style.left = left - deltaX + "px";
      } else if (deltaX > 0) {
        this.slides.style.left = left - deltaX + "px";
      }
    } else {
      throw new Error("Calendar slides not found");
    }

    event.preventDefault();
  }

  handleTouchGrab(event: TouchEvent): void {
    const clientX: number = event.touches[0].clientX;
    this.isDragging = true;
    if (this.slides) {
      this.offsetX =
        clientX + Math.abs(this.slides.getBoundingClientRect().left);
    } else {
      throw new Error("Calendar slides not found");
    }

    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
  }

  handleMouseGrab(event: MouseEvent): void {
    this.isDragging = true;

    if (this.slides) {
      this.offsetX =
        event.clientX + Math.abs(this.slides.getBoundingClientRect().left);

      document.addEventListener("mousemove", this.handleMouseTouchMove);
      document.addEventListener("mouseup", this.handleTouchEnd);

      document.body.style.cursor = "grabbing";
    } else {
      throw new Error("Calendar slides not found");
    }
  }

  handleTouchMove(event: TouchEvent): void {
    const window: number = document.documentElement.clientWidth;

    if (this.slides) {
      if (this.isDragging) {
        let clientX = event.touches[0].clientX,
          left = clientX - this.offsetX,
          leftBorder = -2 * window;
        if (
          this.slides.getBoundingClientRect().left < leftBorder ||
          this.slides.getBoundingClientRect().left > 0
        ) {
          this.slides.style.left = window + "px";
          this.offsetX =
            event.touches[0].clientX +
            Math.abs(this.slides.getBoundingClientRect().left);
        }
        this.slides.style.left = left + "px";
      }
    } else {
      throw new Error("Calendar slides not found");
    }
  }

  handleMouseTouchMove(event: MouseEvent): void {
    const window: number = document.documentElement.clientWidth;

    if (this.slides) {
      if (this.isDragging) {
        let clientX = event.clientX,
          left = clientX - this.offsetX,
          leftBorder = -2 * window;
        if (
          this.slides.getBoundingClientRect().left < leftBorder ||
          this.slides.getBoundingClientRect().left > 0
        ) {
          this.slides.style.left = window + "px";
          this.offsetX =
            event.clientX + Math.abs(this.slides.getBoundingClientRect().left);
        }
        this.slides.style.left = left + "px";
      }
    } else {
      throw new Error("Calendar slides not found");
    }
  }

  handleTouchEnd(): void {
    this.isDragging = false;
    document.body.style.cursor = "grab";
  }
}
