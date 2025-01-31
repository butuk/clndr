import { createElement } from "./helpFunctions";

export class ZoomOutButton {
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
    //closeBut.addEventListener("click", (e) => this.remove(e, cellSlider));
  }
}
