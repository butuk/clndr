import State from "./State.ts";

export class YearIndicator {
  private state = State.getInstance();
  private element: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement("span");
    this.element.textContent = this.state.get("year").toString();

    this.state.subscribeTo("year", (year: number) => {
      this.element.textContent = year.toString();
    });

    container.append(this.element);
  }
}
