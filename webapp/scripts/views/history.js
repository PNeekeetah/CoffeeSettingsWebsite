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
        const query = filter.value.trim().toLowerCase();
        const rows = extractions
            .filter((e) => matchesQuery(e.coffee, query))
            .slice(0, MAX_RESULTS);
        listEl.innerHTML = rows.map(rowHtml).join('') || emptyHtml();
    };

    const renderSuggestions = () => {
        const query = filter.value.trim().toLowerCase();
        const coffees = [...new Set(extractions.map((e) => e.coffee))]
            .filter((name) => name.toLowerCase().includes(query))
            .sort()
            .slice(0, 8);

        suggestions.innerHTML = coffees
            .map((name) => `<li role="option" class="combo__item">${name}</li>`)
            .join('');

        suggestions.hidden = coffees.length === 0;
    };

    const toggleSuggestions = () => {
        if (suggestions.hidden === false) {
            suggestions.hidden = true;
            return;
        }

        renderSuggestions();
    };

    suggestions.addEventListener('click', (event) => {
        const item = event.target.closest('.combo__item');
        if (!item) return;

        filter.value = item.textContent.trim();
        suggestions.hidden = true;
        draw();
    });

    filter.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleSuggestions();
    });

    filter.addEventListener('focus', () => {
        renderSuggestions();
    });

    filter.addEventListener('input', () => {
        renderSuggestions();
        draw();
    });

    const load = async () => {
        const data = await api.listExtractions();
        extractions = Array.isArray(data) ? data : [];
        draw ();
    };

    return {onShow : load};
}

function matchesQuery(value, query) {
    if (!query) return true;
    return value.toLowerCase() === query;
}

function rowHtml(e) {
    const q = quality(e.time);
    return `
    <li class="history__item" style=border-left-color:${q.color}">
        <span class="history__dot" style="background:${q.color}"></span>
        <span class="history__text">
            ${e.coffee} - ${e.time}s - Grind ${e.grind} - ${e.temperature} C° - <strong>${q.label}</strong>
        </span>
    </li>`;
}

function emptyHtml() {
    return `<li class="history__empty">No extractions yet.</li>`;
}