import { createElement } from "./helpFunctions.js";
export class Visualization {
    constructor(container, year) {
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
        var _a;
        // const days: DaysMap = new Map();
        let date = new Date(this.year, 0, 1); // January 1st
        while (date.getFullYear() === this.year) {
            const cell = createElement("div", "calendar-cell");
            cell.style.gridRow = `${date.getMonth() + 2}`;
            cell.style.gridColumn = `${date.getDate() + 1}`;
            if (this.slides && typeof this.slides.append === "function") {
                this.slides.append(cell);
            }
            else {
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
        (_a = this.slider) === null || _a === void 0 ? void 0 : _a.append(`${this.slides}`);
        if (this.content && typeof this.content.append === "function") {
            this.content.append(`${this.slider}`);
        }
        else {
            console.error("Content element is not available for appending the slider.");
        }
    }
}
