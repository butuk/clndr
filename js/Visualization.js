export class Visualization {
    constructor(year, container) {
        this.year = year;
        this.container = container;
        this.element = document.createElement("div");
        this.element.classList.add('view');
    }

    render() {
    }

    /*show() {
        this.element.style.display = '';
    }

    hide() {
        this.element.style.display = 'none';
    }

    destroy() {
        this.element.remove();
    }*/
}