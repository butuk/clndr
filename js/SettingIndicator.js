import { createElement } from "./helpFunctions.js";
import { interfaceElements } from "../dictionaries/interfaceElements.js";

export class SettingIndicator {
  constructor(type, parameter, block, place) {
    this.type = type;
    this.block = createElement(`${block}`, "parameter");
    place = document.querySelector(`.${place}`);
    place.append(this.block);
    this.parameter = parameter;
  }

  set parameter(value) {
    this.block.innerHTML = interfaceElements[this.type][value];
  }

  update(value) {
    this.parameter = value;
  }
}
