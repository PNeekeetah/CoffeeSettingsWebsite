import { api } from '../api.js';
import { quality } from '../gradient.js';
import { setupCombobox } from '../combobox.js';

// Input Extraction view: a searchable coffee field + three numeric fields,
// with "From Last" (prefill) and "Submit" (with red validation) buttons.

export function renderExtraction(root) {
  root.innerHTML = `
    <p class="view__caption">How did you prepare today's coffee?</p>
    <div class="card">
      <div class="combo" data-field="coffee">
        <input class="input" id="ex-coffee" type="text" placeholder="Coffee"
               autocomplete="off" aria-label="Coffee" />
        <ul class="combo__list" role="listbox" hidden></ul>
      </div>
      <input class="input" id="ex-grind" type="number" step="any" min="0" placeholder="Grinder Size" data-field="grind" />
      <input class="input" id="ex-time" type="number" step="any" min="0" placeholder="Extraction Time (s)" data-field="time" />
      <input class="input" id="ex-qty" type="number" step="any" min="0" placeholder="Extraction Quantity" data-field="quantity" />
      <input class="input" id="ex-temp" type="number" step="any" min="0" placeholder="Temperature (C)" data-field="temperature" />
      <div class="card__actions">
        <button class="btn btn--ghost" id="ex-from-last" type="button">From Last</button>
        <button class="btn btn--primary" id="ex-submit" type="button">Submit</button>
      </div>
    </div>
    <div class="result" id="ex-result" hidden>
      <span class="result__label"></span>
      <span class="result__detail"></span>
    </div>
  `;

  const fields = {
    coffee: root.querySelector('#ex-coffee'),
    grind: root.querySelector('#ex-grind'),
    time: root.querySelector('#ex-time'),
    quantity: root.querySelector('#ex-qty'),
    temperature: root.querySelector('#ex-temp')
  };

  const submitBtn = root.querySelector('#ex-submit');
  const fromLastBtn = root.querySelector('#ex-from-last');
  const resultBox = root.querySelector('#ex-result');

  const combo = setupCombobox(root.querySelector('.combo'), fields.coffee);

  // Numeric fields must not be negative.
  const numericFields = [fields.grind, fields.time, fields.quantity, fields.temperature];
  const isNegative = (el) => Number(el.value) < 0;

  // As the user edits: clear the error, but keep it red if the value is negative.
  Object.values(fields).forEach((el) =>
    el.addEventListener('input', () =>
      el.classList.toggle('input--error', numericFields.includes(el) && isNegative(el))
    )
  );

  fromLastBtn.addEventListener('click', async () => {
    const last = await api.lastExtraction();
    if (!last) return;
    fields.coffee.value = last.coffee ?? '';
    fields.grind.value = last.grind ?? '';
    fields.time.value = last.time ?? '';
    fields.quantity.value = last.quantity ?? '';
    fields.temperature.value = last.temperature ?? '';
    Object.values(fields).forEach((el) => el.classList.remove('input--error'));
    submitBtn.classList.remove('btn--error');
  });

  submitBtn.addEventListener('click', async () => {
    // A field is invalid if it's empty or (for numeric fields) negative.
    const invalid = Object.values(fields).filter(
      (el) => el.value.trim() === '' || (numericFields.includes(el) && isNegative(el))
    );
    if (invalid.length) {
      submitBtn.classList.add('btn--error');
      invalid.forEach((el) => el.classList.add('input--error'));
      return;
    }

    const payload = {
      coffee: fields.coffee.value.trim(),
      grind: Number(fields.grind.value),
      time: Number(fields.time.value),
      quantity: Number(fields.quantity.value),
      temperature: Number(fields.temperature.value),
    };
    await api.createExtraction(payload);

    // Success: everything back to normal, then show the result.
    submitBtn.classList.remove('btn--error');
    Object.values(fields).forEach((el) => el.classList.remove('input--error'));
    showResult(resultBox, payload.time);
  });

  // Refresh the coffee options whenever the tab is shown (a coffee may have
  // been added on the Coffee tab); form inputs are left untouched.
  return { onShow: () => combo.reload() };
}

function showResult(box, seconds) {
  const q = quality(seconds);
  box.hidden = false;
  box.style.background = q.color;
  box.querySelector('.result__label').textContent = q.label;
  box.querySelector('.result__detail').textContent = `${seconds}s extraction`;
}