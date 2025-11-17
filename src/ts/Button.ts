import { createElement } from "./helpFunctions.js";

export class Button {
  protected element?: HTMLElement | SVGElement;
  protected clickHandler?: () => void;
  constructor(
    place: HTMLElement | SVGElement,
    el: string,
    content: string,
    className?: string | undefined,
    id?: string | undefined,
    onClick?: () => void,
  ) {
    this.clickHandler = onClick;
    this.onClickAction = this.onClickAction.bind(this);
    this.render(place, content, el, className, id);
  }

  setClickHandler(handler: () => void) {
    this.clickHandler = handler;
  }

  setText(content: string): void {
    if (this.element) {
      this.element.innerHTML = content;
    }
  }

  protected render(
    place: HTMLElement | SVGElement,
    content: string,
    el: string,
    className?: string | undefined,
    id?: string | undefined,
  ): void {
    this.element = createElement(el, className, id);
    this.element.innerHTML = content;
    this.element?.addEventListener("click", this.onClickAction);
    place.append(this.element);
  }

  onClickAction(): void {
    if (this.clickHandler) {
      this.clickHandler();
    }
  }
}
