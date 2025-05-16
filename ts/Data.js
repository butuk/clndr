import { Year } from "./Year.js";
export class Data {
    constructor(num) {
        const year = new Year(num);
        this.years = [];
        this.years.push(year);
    }
}
