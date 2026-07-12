import { api } from '../api.js';

// Input Coffee view: register a coffee (name + roast) via POST server/coffee.

const ROASTS = ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];

export function renderCoffee(root) {
  root.innerHTML = `
    <p class="view__caption">What are we drinking?</p>
    <div class="card">
      <input class="input" id="co-name" type="text" placeholder="Coffee Name" data-field="name" />
      <select class="input" id="co-roast" data-field="roast">
        <option value="" disabled selected>Roast</option>
        ${ROASTS.map((r) => `<option value="${r}">${r}</option>`).join('')}
      </select>
      <div class="card__actions card__actions--center">
        <button class="btn btn--primary" id="co-submit" type="button">Submit</button>
      </div>
      <p class="card__note" id="co-note" hidden></p>
    </div>
  `;

  const name = root.querySelector('#co-name');
  const roast = root.querySelector('#co-roast');
  const submit = root.querySelector('#co-submit');
  const note = root.querySelector('#co-note');

  [name, roast].forEach((el) =>
    el.addEventListener('input', () => el.classList.remove('input--error'))
  );

  submit.addEventListener('click', async () => {
    const missing = [name, roast].filter((el) => el.value.trim() === '');
    if (missing.length) {
      submit.classList.add('btn--error');
      missing.forEach((el) => el.classList.add('input--error'));
      return;
    }

    await api.createCoffee({ name: name.value.trim(), roast_level: roast.value });

    submit.classList.remove('btn--error');
    name.value = '';
    roast.selectedIndex = 0;
    note.hidden = false;
    note.textContent = 'Coffee saved.';
  });
}