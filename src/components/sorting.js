import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // #3.1
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // #3.2
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // #3.3
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // Защита: если сортировка не выбрана — возвращаем данные как есть
    if (!field || !order || order === "none") {
      return data;
    }

    return sortCollection(data, field, order);
  };
}
