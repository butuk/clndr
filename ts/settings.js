export const settings = {
    set() {
        this._language = "eng";
        this._country = "PL";
    },
    set language(language) { },
    get language() {
        return this._language;
    },
    set country(country) { },
    get country() {
        return this._country;
    },
};
