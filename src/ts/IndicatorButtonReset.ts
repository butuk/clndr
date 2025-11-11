import { Button } from "./Button.ts";
import State from "./State.ts";

export class IndicatorButtonReset extends Button {
  protected state = State.getInstance();
  private aimYear = new Date().getFullYear();

  constructor(element: HTMLElement) {
    super(element);

    this.indicateStateOn(element);
  }

  protected onClickAction() {
    this.state.set("year", this.aimYear);
  }

  protected indicateStateOn(element: HTMLElement) {
    this.state.subscribeTo("year", (year: number) => {
      if (this.state.get("year") > this.aimYear) {
        element.classList.remove("birka_hidden");
        element.classList.remove("birka_top");
        element.classList.add("birka_bottom");
        element.textContent = `>${this.aimYear.toString()}`;
      } else if (this.state.get("year") < this.aimYear) {
        element.classList.remove("birka_hidden");
        element.classList.remove("birka_bottom");
        element.classList.add("birka_top");
        element.textContent = `${this.aimYear.toString()}>`;
      } else {
        element.classList.remove("birka_top");
        element.classList.add("birka_hidden");
        element.textContent = "";
      }
    });
  }
}
