export class Visualization {
    constructor(container, year) {
        this.year = year ? year : new Date().getFullYear();
        this.container = container ? container : null;
        console.log(this.year);
        this.create();
    }
    create() {
        // Days of the chosen year
        const days = new Map();
        let date = new Date(this.year, 0, 1); // January 1st
        while (date.getFullYear() === this.year) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const formatted = `${yyyy}-${mm}-${dd}`;
            days.set(`${formatted}`, { date: new Date(date) });
            date.setDate(date.getDate() + 1);
        }
        console.log(days);
        return days;
    }
}
