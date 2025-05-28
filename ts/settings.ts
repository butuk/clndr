type Settings = {
  _language: string;
  _country: string;
  set(): void;
  setLanguage(language: string): void;
  getLanguage(): string;
  setCountry(country: string): void;
  getCountry(): string;
};

export const settings: Settings = {
  set() {
    this._language = "eng";
    this._country = "PL";
  },
  set language(language: string) {},
  get language(): string {
    return this._language;
  },
  set country(country: string) {},
  get country(): string {
    return this._country;
  },
};
