import State from "./State.ts";
import { createElement } from "./helpFunctions.js";

export class Button {
  protected state = State.getInstance();
  private clickHandler?: () => void;
  // private element: HTMLElement | SVGElement;

  /*constructor(element: HTMLElement | SVGElement) {
    this.element = element;
    this.onClickAction = this.onClickAction.bind(this);
    this.element?.addEventListener("click", this.onClickAction);
  }*/
  constructor(
    place: HTMLElement | SVGElement,
    content: string,
    el: string,
    className?: string | undefined,
    id?: string | undefined,
    onClick?: () => void,
  ) {
    this.clickHandler = onClick;
    this.render(place, content, el, className, id);
    this.onClickAction = this.onClickAction.bind(this);
  }

  protected render(
    place: HTMLElement | SVGElement,
    content: string,
    el: string,
    className?: string | undefined,
    id?: string | undefined,
  ): void {
    const element = createElement(el, className, id);
    element.innerHTML = content;
    place.append(element);
    element?.addEventListener("click", this.onClickAction);
  }

  onClickAction(): void {
    if (this.clickHandler) {
      this.clickHandler();
    }
  }
}
