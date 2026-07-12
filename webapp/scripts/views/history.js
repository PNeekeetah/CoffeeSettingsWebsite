import {api} from '../api.js';
import {quality} from '../gradient.js';

const MAX_RESULTS = 100;

export function renderHistory(root) {
    root.innerHTML = `
    <div class="history__filter combo">
        <input class="chip chip--purple" id="hi-filter" type="text"
            placeholder="Coffee Filter" autocomplete="off" aria-label="Coffee filter" />
        <ul class="combo__list" role="listbox" hidden></ul>
    </div>
    <hr class="history__rule" />
    <p class="view__caption">How we fared so far</p>
    <ul class="history__list" id ="hi-list"></ul>
    `;

    const filter = root.querySelector('#hi-filter');
    const suggestions = root.querySelector('.combo__list');
    const listEl = root.querySelector('#hi-list');
    
    let extractions = [];

    const draw = () => {
        const query = filter.value.trim ().toLowerCase();
        const rows = extractions
            .filter((e) => !query || e.coffee.toLowerCase().includes(query))
            .slice(0, MAX_RESULTS);
        listEl.innerHTML = rows.map(rowHtml).join('') || emptyHtml();
    };

    const showSuggestions = () => {
        const query = filter.value.trim().toLowerCase();
        const coffees = [...new Set(extractions.map((e) => e.coffee))]
            .filter((name) => name.toLowerCase().includes(query))
            .sort()
            .slice(0, 8);

        suggestions.innerHTML = coffees
            .map((name) => `<li role="option" class="combo__item">${name}</li>`)
            .join('');
        
        suggestions.hidden = coffees.length === 0;
    }

    filter.addEventListener('focus', showSuggestions);
    filter.addEventListener('input', () => {
        const item = e.target.closest('.combo__item');
        if (!item) return;
        filter.value = item.textContent;
        suggestions.hidden = true;
        draw();
    });

    const load = async () => {
        const data = await api.listExtractions();
        extractions = Array.isArray(data) ? data : [];
        draw ();
    };

    return {onShow : load};
}

function rowHtml(e) {
    const q = quality(e.time);
    return `
    <li class="history__item" style=border-left-color:${q.color}">
        <span class="history__dot" style="background:${q.color}"></span>
        <span class="history__text">
            ${e.coffee} - ${e.time}s - Grind ${e.grind} - <strong>${q.label}</strong>
        </span>
    </li>`;
}

function emptyHtml() {
    return `<li class="history__empty">No extractions yet.</li>`;
}