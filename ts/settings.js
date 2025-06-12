export const settings = {
    _language: "eng",
    _country: "PL",
    set language(language) {
        this._language = language;
        // Translations with JSON
        /*type Translation = {
          [key: string]: string | Translation;
        };
    
        let currentLang: string = "pol";
        let translations: Translation = {};
    
        function getNestedValue(obj: Translation, keyPath: string): string {
          const [key, ...rest] = keyPath.split(".");
    
          const value = obj?.[key];
          if (value === undefined) {
            return "";
          }
          if (rest.length === 0) {
            return value as string;
          }
          return getNestedValue(value as Translation, rest.join("."));
        }
    
        function applyTranslations(translations: Translation): void {
          document.querySelectorAll("[data-word]").forEach((el) => {
            const key: string = el.getAttribute("data-word") || "";
            const value: string = getNestedValue(translations, key);
            console.log(value);
            if (value) {
              el.textContent = value;
            }
          });
        }
    
        async function loadLanguage(lang: string): Promise<Translation> {
          const res = await fetch(`./dictionaries/languages/${lang}.json`);
          translations = await res.json();
          return translations;
        }
    
        (async () => {
          const translations = await loadLanguage(currentLang);
          applyTranslations(translations);
        })();*/
    },
    get language() {
        return this._language;
    },
    set country(country) {
        this._country = country;
    },
    get country() {
        return this._country;
    },
};
