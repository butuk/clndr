import { createElement } from "./helpFunctions.ts";
import { Control } from "./Control.ts";
import State from "./State.ts";

export class VisualizationHeader {
  protected state = State.getInstance();
  constructor() {
    // VisualizationHeader with year indicator
    const header: HTMLElement | SVGElement = createElement("header", "header");

    // Control that decreases the year by 1
    new Control(header, "span", "−", "button", "minus", () => {
      this.state.set("year", this.state.get("year") - 1);
    });

    // Year indicator
    const yearIndicator: HTMLElement | SVGElement = createElement(
      "span",
      "year",
    );
    yearIndicator.textContent = this.state.get("year").toString();
    header.append(yearIndicator);

    // Control that increases the year by 1
    new Control(header, "span", "+", "button", "plus", () => {
      this.state.set("year", this.state.get("year") + 1);
    });

    document.body.append(header);

    // Control that resets the year to the current year
    const buttonReset = new Control(
      document.body,
      "div",
      "reset",
      "birka",
      "reset",
      () => {
        this.state.set("year", new Date().getFullYear());
      },
    );
    buttonReset.addClass("birka_hidden");

    // On year change action
    this.state.subscribeTo("year", (year: number) => {
      yearIndicator.textContent = year.toString();
      if (this.state.get("year") > new Date().getFullYear()) {
        buttonReset.removeClass("birka_hidden");
        buttonReset.removeClass("birka_top");
        buttonReset.addClass("birka_bottom");
        buttonReset.setText(`>${new Date().getFullYear()}`);
      } else if (this.state.get("year") < new Date().getFullYear()) {
        buttonReset.removeClass("birka_hidden");
        buttonReset.removeClass("birka_bottom");
        buttonReset.addClass("birka_top");
        buttonReset.setText(`${new Date().getFullYear().toString()}>`);
      } else {
        buttonReset.addClass("birka_hidden");
      }
    });

    //Country
    const files = import.meta.glob("../dictionaries/countries/*.json");

    const fileNames = Object.keys(files)
      .map((path) => path.split("/").pop()?.replace(".json", "") || "")
      .filter((name) => name) // Убираем пустые имена, если что-то пошло не так
      .sort(); // Сортируем, чтобы порядок был всегда одинаковым (например, алфавитным)

    let currentIndex = 0; // Если файлов нет, используем "EN" как запасной вариант
    const initialText = fileNames.length > 0 ? fileNames[0] : "EN";
    const language = new Control(
      document.body,
      "div",
      initialText,
      "switcher",
      "country",
      (): void => {
        if (fileNames.length === 0) return;

        // Увеличиваем индекс и берем остаток от деления на длину массива,
        // чтобы при достижении конца массива индекс сбрасывался на 0
        currentIndex = (currentIndex + 1) % fileNames.length;
        language.setText(fileNames[currentIndex]);

        // Если нужно также обновлять стейт:
        // state.set("country", fileNames[currentIndex]);
      },
    );
  }
}
