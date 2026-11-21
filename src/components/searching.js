import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // #5.1
  const compare = createComparison({
    skipEmptyTargetValues: rules.skipEmptyTargetValues,
    search: rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false,
    ),
  });

  return (data, state, action) => {
    // #5.2
    return data.filter((row) => compare(row, state));
  };
}
