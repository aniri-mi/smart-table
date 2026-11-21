import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const { data, ...indexes } = initData(sourceData);

function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage) || 10;
  const page = parseInt(state.page ?? 1) || 1;
  return {
    ...state,
    rowsPerPage,
    page,
  };
}

function render(action) {
  let state = collectState();
  let result = [...data];
  console.log("START", result.length, JSON.stringify(state));

  result = applySearching(result, state, action);
  console.log("after searching", result.length);

  result = applyFiltering(result, state, action);
  console.log("after filtering", result.length);

  result = applySorting(result, state, action);
  console.log("after sorting", result.length);

  result = applyPagination(result, state, action);
  console.log("after pagination", result.length);

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

const applySearching = initSearching("search");

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers,
});

const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
