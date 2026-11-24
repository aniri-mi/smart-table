export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
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
  };

  const applyFiltering = (query, state, action) => {
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

    // #4.5 — формирование параметров фильтра
    const filter = {};
    Object.keys(elements).forEach((key) => {
      const el = elements[key];
      if (el && ["INPUT", "SELECT"].includes(el.tagName) && el.value) {
        filter[`filter[${el.name}]`] = el.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
