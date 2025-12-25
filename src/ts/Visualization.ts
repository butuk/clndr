import { createElement, intToRoman } from "./helpFunctions.ts";
import State from "./State.ts";
import { VisualizationHeader } from "./VisualizationHeader.ts";

type CountryDictionary = {
  "working-day": {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  holidays?: Record<string, string>;
};

const countryDictLoaders = import.meta.glob(
  "../dictionaries/countries/*.json",
  { import: "default" },
) as Record<string, () => Promise<CountryDictionary>>;

async function loadCountryDictionary(
  country: string,
): Promise<CountryDictionary> {
  const code = (country || "").toUpperCase();
  const loader = countryDictLoaders[`../dictionaries/countries/${code}.json`];

  if (!loader) {
    throw new Error(`Country dictionary not found for: ${code}`);
  }

  return loader();
}

function dayKeyFromDate(date: Date): keyof CountryDictionary["working-day"] {
  // JS: 0=Sun,1=Mon,...6=Sat
  const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  return keys[date.getDay()];
}

function monthDayFromDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

export class Visualization {
  private state = State.getInstance();
  year: number;
  country: string;
  condition: boolean = false;
  slider: HTMLElement | SVGElement | null;
  slides: HTMLElement | SVGElement | null;
  container: HTMLElement;
  delta: number = 3;
  isDragging: boolean = false;
  offsetX: number = 0;
  lastClientX: number = 0;
  grabCoef: number = 1.05;

  constructor(container: HTMLElement) {
    this.container = container;

    this.country = this.state.get("country");

    // Year and subscription to year change
    this.year = this.state.get("year") ?? new Date().getFullYear();
    this.state.subscribeTo("year", (newYear: number) => {
      this.updateYear(newYear);
    });

    // Re-render on country change
    this.state.subscribeTo("country", (newCountry: "string") => {
      this.updateCountry(newCountry);
    });

    //"Window" for visible slide
    this.slider = document.querySelector(".calendar-slider")
      ? document.querySelector(".calendar-slider")
      : createElement("section", "calendar-slider");

    //Slides container
    this.slides = document.querySelector(".calendar-slides")
      ? document.querySelector(".calendar-slides")
      : createElement("section", "calendar-slides");

    new VisualizationHeader();
    this.renderYear();
  }

  private async renderYear(): Promise<void> {
    this.country = this.state.get("country");
    const dict = await loadCountryDictionary(this.country);

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
        const cell: HTMLElement | SVGElement = createElement(
          "svg",
          "calendar-cell",
        );
        cell.setAttribute("data-date", date.toLocaleDateString("en-CA"));

        cell.style.gridRow = `${date.getMonth() + 3}`;
        cell.style.gridColumn = `${columnNum}`;
        cell.style.top = `${this.delta * columnNum}%`;
        cell.setAttribute("viewBox", "0 0 100 100");

        const dayKey = dayKeyFromDate(date);

        let isWorkingDay = dict["working-day"][dayKey];
        if (Object.prototype.hasOwnProperty.call(dict.holidays, monthDayFromDate(date))) {
          isWorkingDay = false
          cell.setAttribute("special-day", dict.holidays[`${monthDayFromDate(date)}`])
        };

        const day = isWorkingDay
          ? createElement("circle", "working-day")
          : createElement("rect", "special-day");

        cell.append(day);
        slide.append(cell);
        date.setDate(date.getDate() + 1);
      }

      this.slides?.append(slide);
    }

    this.slider?.append(this.slides!);

    this.container.append(this.slider!);

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

  private updateYear(newYear: number): void {
    this.year = newYear;
    this.clearYear();
    this.renderYear();
  }

  private updateCountry(newCountry: string): void {
    this.country = newCountry;
    this.clearYear();
    this.renderYear();
  }

  private clearYear() {  //Clear old elements if any
    if (this.slides) {
      this.slides.style.left = "-100%";
      this.slides.innerHTML = "";
    }
  }

  //Date name
  private renderColumnHR(
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
    hr.style.gridRow = "0";
    hr.style.gridColumn = `${columnNum}`;
    hr.textContent = `${columnNum - 1}`;
    hr.style.top = `${this.delta * columnNum}%`;
    where.append(hr);
    return this;
  }

  //Month names
  private renderRowHR(
    rowNum: number,
    where: HTMLElement | SVGElement,
  ): Visualization {
    const monthName: HTMLElement | SVGElement = createElement(
      "div",
      "calendar-cell-hr",
    );
    monthName.style.gridColumn = "1";
    monthName.style.gridRow = `${rowNum + 3}`;

    monthName.textContent = intToRoman(rowNum + 1);

    where.append(monthName);

    return this;
  }

  private centerVisualization(): void {
    if (this.slides) {
      const oneCell: Element | null =
        this.slides.querySelector(".calendar-cell");
      const centerX: number = document.documentElement.clientWidth / 2,
        currentDay: Element = document.querySelectorAll(".current-date")[1],
        slidesX: number = this.slides.getBoundingClientRect().left,
        dayWidth: number | null = oneCell
          ? oneCell.getBoundingClientRect().width
          : null;

      if (this.year === new Date().getFullYear() && dayWidth !== null) {
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

  private addListeners = (): void => {
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
  };

  private handleWheelEvent = (event: WheelEvent): void => {
    const windowWidth: number = document.documentElement.clientWidth,
      deltaY: number = event.deltaY,
      deltaX: number = event.deltaX;

    if (this.slides) {
      let left: number = this.slides.getBoundingClientRect().left;

      const leftBorder: number = -2 * windowWidth;
      if (left < leftBorder || left > 0) {
        this.slides.style.left = -windowWidth + "px";
        left = -windowWidth;
      }
      this.slides.style.left = left - deltaY - deltaX + "px";

      // Отправляем событие для анимации canvas
      const scrollEvent = new CustomEvent("scrollAnimation", {
        detail: { deltaY, deltaX },
      });
      document.dispatchEvent(scrollEvent);
    } else {
      throw new Error("Calendar slides not found");
    }

    event.preventDefault();
  };

  private handleTouchGrab = (event: TouchEvent): void => {
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
  };

  private handleMouseGrab = (event: MouseEvent): void => {
    this.isDragging = true;

    if (this.slides) {
      this.lastClientX = event.clientX;
      this.offsetX =
        event.clientX + Math.abs(this.slides.getBoundingClientRect().left);

      document.addEventListener("mousemove", this.handleMouseTouchMove);
      document.addEventListener("mouseup", this.handleTouchEnd);

      document.body.style.cursor = "grabbing";
    } else {
      throw new Error("Calendar slides not found");
    }
  };

  private handleTouchMove = (event: TouchEvent): void => {
    const window: number = document.documentElement.clientWidth;

    if (this.slides) {
      if (this.isDragging) {
        const currentClientX = event.touches[0].clientX;
        const deltaX = this.lastClientX - currentClientX;
        this.lastClientX = currentClientX;

        const scrollEvent = new CustomEvent("scrollAnimation", {
          detail: { deltaY: 0, deltaX: deltaX * this.grabCoef },
        });
        document.dispatchEvent(scrollEvent);

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
  };

  private handleMouseTouchMove = (event: MouseEvent): void => {
    const window: number = document.documentElement.clientWidth;

    if (this.slides) {
      if (this.isDragging) {
        const deltaX = this.lastClientX - event.clientX;
        this.lastClientX = event.clientX;

        const scrollEvent = new CustomEvent("scrollAnimation", {
          detail: { deltaY: 0, deltaX: deltaX * this.grabCoef },
        });
        document.dispatchEvent(scrollEvent);

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
  };

  private handleTouchEnd = (): void => {
    this.isDragging = false;
    document.body.style.cursor = "grab";
  };
}
