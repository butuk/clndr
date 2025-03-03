import { createElement } from "./helpFunctions.js";

export class CloseButton {
  constructor() {
    this.create();
  }

  create() {
    let closeBut = document.querySelector(".close-button");
    if (closeBut) {
      closeBut.remove();
    }
    closeBut = createElement("div", "close-button");
    document.body.append(closeBut);
    return closeBut;
  }
}
