import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // подготовить шаблон кнопки ОДИН РАЗ при инициализации
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage || 10;
    let page = state.page || 1;

    // пока pageCount ещё не известен (первый запрос), ограничиваем только снизу
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = pageCount ? Math.min(pageCount, page + 1) : page + 1;
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount || page;
          break;
      }
    }

    if (pageCount) {
      page = Math.min(Math.max(1, page), pageCount);
    } else {
      page = Math.max(1, page);
    }

    return Object.assign({}, query, { limit, page });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit) || 1;

    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    fromRow.textContent = total ? (page - 1) * limit + 1 : 0;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
