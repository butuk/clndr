import State from "./State.ts";

export class Button {
  protected state = State.getInstance();
  private element: HTMLElement | SVGElement;

  constructor(element: HTMLElement | SVGElement) {
    this.element = element;
    this.onClickAction = this.onClickAction.bind(this);
    this.element?.addEventListener("click", this.onClickAction);
  }

  protected onClickAction() {}
}
