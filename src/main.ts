import "./styles.scss";
import State from "./ts/State.ts";
import { Visualization } from "./ts/Visualization.ts";
import { IndicatorOfScroll } from "./ts/IndicatorOfScroll.ts";
import { Control } from "./ts/Control.ts";

// User's browser tab title
const date = new Date();
document.title = `${date.getDate()}.${
  date.getMonth() + 1
}.${date.getFullYear()}`;

// Disable context menu
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// Create main content
document.addEventListener("DOMContentLoaded", () => {
  // System start state
  const state = State.getInstance();
  state.set("year", new Date().getFullYear());

  // Calendar visualization
  new Visualization(document.body);

  // Scroll indicator
  new IndicatorOfScroll();

  //Country
  const files = import.meta.glob("./dictionaries/countries/*.json");

  const fileNames = Object.keys(files)
    .map((path) => path.split("/").pop()?.replace(".json", "") || "")
    .filter((name) => name) // Убираем пустые имена, если что-то пошло не так
    .sort(); // Сортируем, чтобы порядок был всегда одинаковым (например, алфавитным)

  let currentIndex = 0; // Если файлов нет, используем "EN" как запасной вариант
  const initialText = fileNames.length > 0 ? fileNames[0] : "◍";
  const country = new Control(
    document.body,
    "div",
    initialText,
    "switcher",
    "country",
    (): void => {
      if (fileNames.length === 0) console.log("clicked"); //;return;

      // Увеличиваем индекс и берем остаток от деления на длину массива,
      // чтобы при достижении конца массива индекс сбрасывался на 0
      currentIndex = (currentIndex + 1) % fileNames.length;
      country.setText(fileNames[currentIndex]);

      // Если нужно также обновлять стейт:
      state.set("country", fileNames[currentIndex]);
    },
  );
});
