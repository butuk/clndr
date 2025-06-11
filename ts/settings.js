export const settings = {
    _language: "eng",
    _country: "PL",
    set() { },
    set language(language) {
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
        async function loadLanguage(lang) {
            const res = await fetch(`./dictionaries/languages/${lang}.json`);
            translations = await res.json();
            return translations;
        }
        (async () => {
            const translations = await loadLanguage(currentLang);
            applyTranslations(translations);
        })();
    },
    get language() {
        return this._language;
    },
    set country(country) { },
    get country() {
        return this._country;
    },
};
