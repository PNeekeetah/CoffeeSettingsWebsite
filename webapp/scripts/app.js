import { renderExtraction} from './views/extraction.js';
import { renderCoffee } from './views/coffee.js';
import { renderHistory } from './views/history.js';

const views = {
    extraction: { el: document.getElementById('view-extraction'), render: renderExtraction },
    coffee: { el: document.getElementById('view-coffee'), render: renderCoffee },
    history: { el: document.getElementById('view-history'), render: renderHistory }
}

const tabs = document.querySelectorAll('.tab');

for (const view of Object.values(views)) {
    view.ctrl = view.render(view.el) || {};
}

function show(name) {
    for (const [key, view] of Object.entries(views)) {
        const active = key === name;
        view.el.hidden = !active;
        if (active) view.ctrl.onShow?.();
    }

    tabs.forEach((tab) => {
        const active = tab.dataset.view === name;
        tab.classList.toggle('tab--active', active);
        tab.setAttribute('aria-selected', String(active));
    });
}

tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.view)));

show('extraction');