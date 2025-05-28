var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*import { months } from "./dictionaries/months.js";

const today = new Date();
const todaysDay: number = today.getMonth();
const month = months.get(todaysDay);
const neededVersion = month?.bel_1;
console.log(neededVersion);*/
// User's browser tab title
const date = new Date();
document.title = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
// Disable context menu
window.oncontextmenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
// Translations with JSON
let currentLang = "pol";
let translations = {};
function getNestedValue(obj, keyPath) {
    const [key, ...rest] = keyPath.split(".");
    const value = obj === null || obj === void 0 ? void 0 : obj[key];
    if (value === undefined) {
        return "";
    }
    if (rest.length === 0) {
        return value;
    }
    return getNestedValue(value, rest.join("."));
}
function applyTranslations(translations) {
    document.querySelectorAll("[data-word]").forEach((el) => {
        const key = el.getAttribute("data-word") || "";
        const value = getNestedValue(translations, key);
        console.log(value);
        if (value) {
            el.textContent = value;
        }
    });
}
function loadLanguage(lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`./dictionaries/${lang}.json`);
        translations = yield res.json();
        return translations;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const translations = yield loadLanguage(currentLang);
    applyTranslations(translations);
}))();
export {};
