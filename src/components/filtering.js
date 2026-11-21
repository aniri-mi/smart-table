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

  // #4.3 — компаратор: массив имён правил (defaultRules уже включает arrayAsRange)
  const compare = createComparison(defaultRules);

  // Приводит строку из input к числу или undefined, если пусто/не число
  const toNumber = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const num = Number(String(value).replace(/\s/g, "").replace(",", "."));
    return Number.isNaN(num) ? undefined : num;
  };

  // Преобразует state формы в state, понятный компаратору:
  // totalFrom/totalTo -> total: [from, to]
  const normalizeState = (state) => {
    const from = toNumber(state.totalFrom);
    const to = toNumber(state.totalTo);

    // Если оба поля пусты — не добавляем total в state,
    // чтобы skipEmptyTargetValues не пропустил сравнение,
    // а точнее — чтобы total вообще не участвовал в фильтрации
    if (from === undefined && to === undefined) {
      return state;
    }

    const { totalFrom, totalTo, ...rest } = state;
    return {
      ...rest,
      total: [from, to],
    };
  };

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
    const normalized = normalizeState(state);
    return data.filter((row) => compare(row, normalized));
  };
}
