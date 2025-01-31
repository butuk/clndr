import { createElement } from "./helpFunctions.js";

export class SettingControls {
  constructor(parameter, setParameter, optionsGroup) {
    this.line = createElement("div", "options-line");
    Object.keys(optionsGroup).forEach((key) => {
      const optionItem = optionsGroup[key];
      const block = createElement("div", "option");
      block.dataset[`${parameter}`] = key;
      if (setParameter === key) {
        block.classList.add("option_active");
      }
      block.innerHTML = optionItem;
      this.line.append(block);
    });
    return this;
  }

  get element() {
    return this.line;
  }

  switch(parameter, setParameter) {
    for (let element of this.line.children) {
      element.classList.remove("option_active");
      if (element.dataset[parameter] === setParameter) {
        element.classList.add("option_active");
      }
    }
  }
}
