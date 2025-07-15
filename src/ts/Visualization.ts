import { createElement, createElement2 } from "./helpFunctions.ts";

export class Visualization {
  year: number;
  slider: HTMLElement | null;
  slides: HTMLElement | null;
  columns: number;
  rows: number;

  constructor(container: HTMLElement, year?: number) {
    this.columns = 32;
    this.rows = 14;
    this.year = year ? year : new Date().getFullYear();

    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");

    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("section", "calendar-slides");

    for (let i = 0; i < 3; i++) {
      let date = new Date(this.year, 0, 1); // January 1st

      const slide: HTMLElement | SVGElement = createElement2(
        "svg",
        "calendar-slide",
      );

      let columnWidth: number = 100 / this.columns;
      let rowHeight: number = 100 / this.rows;
      console.log(rowHeight, columnWidth);

      slide.setAttribute("viewBox", "0 0 100 100");
      while (date.getFullYear() === this.year) {
        const cell = createElement2("circle", "calendar-cell");

        // cell.style.gridRow = `${date.getMonth() + 2}`;
        // cell.style.gridColumn = `${date.getDate() + 1}`;
        cell.setAttribute("cx", `${(date.getDate() + 1) * columnWidth}`);
        cell.setAttribute("cy", `${(date.getMonth() + 2) * rowHeight}`);
        cell.setAttribute("r", ".3");
        // cell.setAttribute("fill", "red");

        /*const day = createElement("circle", "working-day");
        day.setAttribute("cx", "50");
        day.setAttribute("cy", "50");
        day.setAttribute("r", "50");
        cell.append(day);*/

        //cell.textContent = `${date.getMonth() + 1}`;

        slide.append(cell);
        /*
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formatted = `${yyyy}-${mm}-${dd}`;
        days.set(`${formatted}`, { date: new Date(date) });
      */

        date.setDate(date.getDate() + 1);
      }

      this.slides?.append(slide);
    }

    this.slider?.append(this.slides!);

    container.append(this.slider!);
  }
}
