import { CloseButton } from "./CloseButton.js";
import { VisualizationOfCalendar } from "./VisualizationOfCalendar.js";
import { VisualizationOfDatesSequence } from "./VisualizationOfDatesSequence.js";

export class Display {
  constructor(year, block) {
    this._visualizations = [];
    this.year = year;
    this.block = block;

    this.cancelNativeBehavior();
    this.runSwitchToDateSlider = this.runSwitchToDateSlider.bind(this);
    this.dateSequenceAppearingEnd = this.dateSequenceAppearingEnd.bind(this);
    this.calendarDisappearingEnd = this.calendarDisappearingEnd.bind(this);

    this.calendar = new VisualizationOfCalendar(this.year, this.block);
    this._visualizations.push(this.calendar);
    this.addEventListeners();
  }

  cancelNativeBehavior() {
    document.addEventListener(
      "touchmove",
      function (event) {
        if (event.scale !== 1) {
          event.preventDefault();
        }
      },
      { passive: false },
    );
  }

  addEventListeners() {
    this.calendar.slider.addEventListener("click", this.runSwitchToDateSlider);
  }

  runSwitchToDateSlider(event) {
    /*const closeBut = new CloseButton();
    closeBut.addEventListener("click", () => {
      this.runSwitchToDateSlider(event);
    });*/
    this.calendar.slider.removeEventListener(
      "click",
      this.runSwitchToDateSlider,
    );
    const clickedCell = event.target.closest(".calendar-cell");
    if (clickedCell) {
      //console.log(clickedCell.getBoundingClientRect());
      this.calendar.slider.classList.add("calendar-slider_hidden");
      this.calendar.slider.addEventListener(
        "transitionend",
        this.calendarDisappearingEnd,
      );
      const startPoint = `${clickedCell.dataset.month}-${clickedCell.dataset.date}`;
      this.dateSequence = new VisualizationOfDatesSequence(this.year, startPoint);

      this.dateSequence.slider.classList.add("day-slider_appear");
      this.dateSequence.slider.addEventListener(
        "animationend",
        this.dateSequenceAppearingEnd,
      );
      this._visualizations.push(this.dateSequence);
    }
  }

  dateSequenceAppearingEnd() {
    this.dateSequence.slider.classList.remove("day-slider_appear");
    this.dateSequence.slider.removeEventListener(
      "animationend",
      this.dateSequenceAppearingEnd,
    );
  }

  calendarDisappearingEnd() {
    //console.log("hi");
    this.calendar.slider.removeEventListener(
      "transitionend",
      this.calendarDisappearingEnd,
    );
  }

  runSwitchToCalendarSlider() {}

  get visualizations() {
    return this._visualizations;
  }
}
