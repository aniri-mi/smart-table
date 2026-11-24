const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

// Нормализует ответ /sellers и /customers к виду { [id]: "Имя Фамилия" }.
// Поддерживает и словарь (как ожидается по заданию), и массив объектов.
const toIndex = (list) => {
  if (!list) return {};
  if (Array.isArray(list)) {
    return Object.fromEntries(
      list.map((v) => [v.id, `${v.first_name} ${v.last_name}`]),
    );
  }
  return list;
};

export function initData() {
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers?.[item.seller_id] ?? "",
      customer: customers?.[item.customer_id] ?? "",
      total: item.total_amount,
    }));

  const getIndexes = async () => {
    if (!sellers || !customers) {
      const [sellersList, customersList] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);
      sellers = toIndex(sellersList);
      customers = toIndex(customersList);
    }
    return { sellers, customers };
  };

  const getRecords = async (query, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    lastQuery = nextQuery;
    lastResult = {
      total: records.total ?? 0,
      items: mapRecords(records.items ?? []),
    };

    return lastResult;
  };

  return {
    getIndexes,
    getRecords,
  };
}
