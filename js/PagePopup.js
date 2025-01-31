import { createElement } from "./helpFunctions.js";
import { interfaceElements } from "../dictionaries/interfaceElements.js";

export class PagePopup {
  constructor(controlsArray) {
    this.controlsArray = controlsArray;
    this.show = this.show.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.show();
  }

  show() {
    this.overlay = createElement("div", "overlay");
    const popup = createElement("div", "popup");
    // Settings lines, if any
    if (this.controlsArray.length > 0) {
      for (let controlsLine of this.controlsArray) {
        popup.append(controlsLine);
      }
    }
    // Links line
    const line = createElement("div", "options-line");
    for (let link of interfaceElements.links) {
      const block = createElement("a", "option");
      block.innerHTML = link.text;
      block.href = link.url;
      block.target = "_blank";
      line.append(block);
    }
    popup.append(line);

    this.overlay.prepend(popup);
    document.body.prepend(this.overlay);
    this.overlay.addEventListener("click", this.hideOverlay);
    popup.addEventListener("click", this.stopPropagation);
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  hideOverlay() {
    this.overlay.classList.add("overlay_fade");
    this.overlay.addEventListener("transitionend", () => {
      this.overlay.remove();
    });
  }
}
