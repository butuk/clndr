import { createElement } from "./helpFunctions.js";
export class Visualization {
    constructor(container, year) {
        var _a, _b;
        this.year = year ? year : new Date().getFullYear();
        this.slider = document.querySelector(".calendar-slider")
            ? document.querySelector(".calendar-slider")
            : createElement("section", "calendar-slider");
        this.slides = document.querySelector(".calendar-slides")
            ? document.querySelector(".calendar-slides")
            : createElement("section", "calendar-slides");
        for (let i = 0; i < 3; i++) {
            const slide = createElement("div", "calendar-slide");
            let date = new Date(this.year, 0, 1); // January 1st
            while (date.getFullYear() === this.year) {
                const cell = createElement("svg", "calendar-cell");
                cell.style.gridRow = `${date.getMonth() + 2}`;
                cell.style.gridColumn = `${date.getDate() + 1}`;
                cell.setAttribute("viewBox", "0 0 100 100");
                cell.setAttribute("width", "100%");
                cell.setAttribute("height", "100%");
                const day = createElement("circle", "working-day");
                day.setAttribute("cx", "50");
                day.setAttribute("cy", "50");
                day.setAttribute("r", "50");
                cell.append(day);
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
            (_a = this.slides) === null || _a === void 0 ? void 0 : _a.append(slide);
        }
        (_b = this.slider) === null || _b === void 0 ? void 0 : _b.append(this.slides);
        container.append(this.slider);
    }
}
