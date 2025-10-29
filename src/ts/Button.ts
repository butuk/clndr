import State from "./State.ts";

export class Button {
  protected state = State.getInstance();
  private element: HTMLElement | null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.onClickAction = this.onClickAction.bind(this);
    this.element?.addEventListener("click", this.onClickAction);
  }

  protected onClickAction() {}
}
