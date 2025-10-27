export default class State {
  //Application state: year, language, country
  private static instance: State;

  //Forbid creating new instances
  private constructor() {}

  //Singleton pattern implementation to have only one state
  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  // State properties
  private properties = {
    year: new Date().getFullYear(),
    language: "eng",
    country: "PL",
  };

  // Setting and getting properties
  get<K extends keyof typeof this.properties>(key: K) {
    return this.properties[key];
  }

  set<K extends keyof typeof this.properties>(
    key: K,
    value: (typeof this.settings)[K],
  ): void {
    this.properties[key] = value;
    this.notify(key, value);
  }

  // Listeners
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  subscribeTo(key: string, callback: (value: any) => void): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
  }

  unsubscribeFrom(key: string, callback: (value: any) => void): void {
    this.listeners.get(key)?.delete(callback);
  }

  notify(key: string, value: any): void {
    this.listeners.get(key)?.forEach((callback) => callback(value));
  }
}
