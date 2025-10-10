import { createElement, intToRoman } from "./helpFunctions.ts";
import { Settings } from "./Settings.ts";

export class Visualization {
  year: number;
  slider: HTMLElement | SVGElement | null;
  slides: HTMLElement | SVGElement | null;
  delta: number = 3;

  constructor(container: HTMLElement, year?: number) {
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

      //Creating months names
      for (let rowNum = 0; rowNum < 12; rowNum++) {
        this.renderRowHR(rowNum, slide);
      }

      //Creating days numbers
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

    const currentDate = new Date();
    const find = document.querySelectorAll(
      `[data-date="${currentDate.toLocaleDateString("en-CA")}"]`,
    );

    find.forEach((e) => {
      let outline = createElement("circle", "current-date");
      console.log(e);
      e.append(outline);
    });
  }

  //Dates names
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

  //Months names
  renderRowHR(rowNum: number, where: HTMLElement | SVGElement) {
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
}
