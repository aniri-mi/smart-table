import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
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
}
// #4.3 — компаратор
const compare = createComparison(defaultRules);
return (data, state, action) => {
  // @todo: #4.2 — обработать очистку поля
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

  // #4.5 — фильтрация
  return data.filter((row) => compare(row, state));
};
// @todo: #4.5 — отфильтровать данные используя компаратор
