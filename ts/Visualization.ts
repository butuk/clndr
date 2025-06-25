import { createElement } from "./helpFunctions.js";

export class Visualization {
  year: number;
  containerName: string;
  content: HTMLElement | null;
  slider: HTMLElement | null;
  slides: HTMLElement | null;

  constructor(container: string, year?: number) {
    this.year = year ? year : new Date().getFullYear();
    this.containerName = container;

    this.content = document.querySelector(this.containerName);

    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");

    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("div", "calendar-slides");
    console.log(this.slides);
    this.create();
  }

  create() {
    // Days of the chosen year

    // const days: DaysMap = new Map();
    let date = new Date(this.year, 0, 1); // January 1st

    while (date.getFullYear() === this.year) {
      const cell = createElement("div", "calendar-cell");
      cell.style.gridRow = `${date.getMonth() + 2}`;
      cell.style.gridColumn = `${date.getDate() + 1}`;
      if (this.slides && typeof this.slides.append === "function") {
        this.slides.append(cell);
      } else {
        console.error("Slides element is not available for appending cells.");
      }

      /*
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formatted = `${yyyy}-${mm}-${dd}`;
        days.set(`${formatted}`, { date: new Date(date) });
      */

      date.setDate(date.getDate() + 1);
    }
    this.slider?.append(`${this.slides}`);
    if (this.content && typeof this.content.append === "function") {
      this.content.append(`${this.slider}`);
    } else {
      console.error(
        "Content element is not available for appending the slider.",
      );
    }
  }
}
