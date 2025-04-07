export class ViewTransitionController {
    constructor(year, container) {
        this.year = year;
        this.container = container;
        this.currentView = null;
    }

    async transitionTo(viewClass) {
        const newView = new viewClass(this.year, this.container);
        newView.render();

        if (this.currentView) {
            await this.animateOut(this.currentView.element);
            this.currentView.destroy();
        }

        await this.animateIn(newView.element);
        this.currentView = newView;
    }

    animateOut(el) {
        return new Promise(resolve => {
            el.classList.add('fade-out');
            el.addEventListener('animationend', resolve, { once: true });
        });
    }

    animateIn(el) {
        return new Promise(resolve => {
            el.classList.add('fade-in');
            el.style.display = '';
            el.addEventListener('animationend', () => {
                el.classList.remove('fade-in');
                resolve();
            }, { once: true });
        });
    }
}
