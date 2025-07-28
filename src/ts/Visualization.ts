import { createElement } from "./helpFunctions.ts";

export class Visualization {
  year: number;
  slider: HTMLElement | SVGElement | null;
  slides: HTMLElement | SVGElement | null;
  delta: number = 3;

  constructor(container: HTMLElement, year?: number) {
    this.year = year ? year : new Date().getFullYear();

    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");

    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("section", "calendar-slides");

    for (let i = 0; i < 3; i++) {
      const slide: HTMLElement | SVGElement = createElement(
        "div",
        "calendar-slide",
      );

      let date = new Date(this.year, 0, 1); // January 1st

      for (let i = 2; i <= 32; i++) {
        this.renderColumnHR(i, slide);
      }
      while (date.getFullYear() === this.year) {
        const cell = createElement("svg", "calendar-cell");
        cell.style.gridRow = `${date.getMonth() + 2}`;
        cell.style.gridColumn = `${date.getDate() + 1}`;
        cell.setAttribute("viewBox", "0 0 100 100");

        const dayOfWeek = date.getDay();

        const day =
          dayOfWeek !== 0 && dayOfWeek !== 6
            ? createElement("circle", "working-day")
            : createElement("rect", "special-day");
        cell.append(day);
        slide.append(cell);

        /*
        //cell.textContent = `${date.getMonth() + 1}`;

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

  renderColumnHR(
    columnNum: number,
    where: HTMLElement | SVGElement,
  ): Visualization {
    if (columnNum < 1 || columnNum > 32) {
      throw new Error("Number for non-existing column");
    }
    const hr = createElement("div", "calendar-cell-hr");
    hr.style.gridRow = "1";
    hr.style.gridColumn = `${columnNum}`;
    hr.textContent = `${columnNum - 1}`;
    //hr.style.top = `${this.delta * columnNum + 50}%`;
    where.append(hr);
    return this;
  }
}
