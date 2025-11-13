import { Button } from "./Button.ts";

export class ButtonPlus extends Button {
  constructor(element: HTMLElement | SVGElement) {
    super(element);
  }

  protected onClickAction() {
    this.state.set("year", this.state.get("year") + 1);
  }
}
