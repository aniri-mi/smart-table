import { createComparison, defaultRules, rules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
  // #4.1 — заполнение select-ов
  Object.keys(indexes).forEach((elementName) => {
    if (!elements[elementName]) return;
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  // #4.3 — компаратор: первый аргумент — МАССИВ имён правил
  // defaultRules уже содержит 'skipEmptyTargetValues', поэтому отдельно его дублировать не нужно
  const compare = createComparison(defaultRules);

  return (data, state, action) => {
    // #4.2 — очистка поля
    if (action && action.name === "clear") {
      const input = action.parentElement.querySelector("input");
      if (input) {
        input.value = "";
        const fieldName = action.dataset.field;
        if (fieldName in state) {
          state[fieldName] = "";
        }
      }
    }

    // #4.5
    return data.filter((row) => compare(row, state));
  };
}
