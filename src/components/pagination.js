import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage || 10;
    let page = state.page || 1;

    // #2.6 — обработка действий пагинатора
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount || 1, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount || 1;
          break;
      }
    }
    page = Math.min(Math.max(1, page), pageCount || 1);

    return Object.assign({}, query, { limit, page });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit) || 1;
    const currentPage = Math.min(page, pageCount);

    // #2.4 — отрисовка кнопок страниц
    const visiblePages = getPages(currentPage, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === currentPage);
      }),
    );

    // #2.5 — статистика
    fromRow.textContent = total ? (currentPage - 1) * limit + 1 : 0;
    toRow.textContent = Math.min(currentPage * limit, total);
    totalRows.textContent = total;
  };

  return {
    updatePagination,
    applyPagination,
  };
};
