import {api} from './api.js';

export function setupCombobox(combo, input) {
    const list = combo.querySelector('.combo__list');
    let coffees = [];

    const reload = () => 
        api.listCoffees().then((data) => {
            cofees = data.map((c) => c.name);
        });
    reload();

    const render = (query) => {
        const q = query.toLowerCase();
        const matches = coffees.filter((name) => name.toLowerCase().includes(q)).slice(0, 8);
        list.innerHTML = matches
            .map((name) => `<li role="option" class="combo__item">${name}</li>`)
            .join('');
        list.hidden = matches.length === 0;
    };

    input.addEventListener('focus', () => render(input.value));
    input.addEventListener('input', () => render(input.value));

    list.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.combo__item');
        if (!item) return;
        input.value = item.textContent;
        input.dispatchEvent(new Event('input', {bubbles: true}));
        list.hidden = true;
    });

    input.addEventListener('blur', () => setTimeout(() => (list.hidden = true), 120));

    return { reload };
}