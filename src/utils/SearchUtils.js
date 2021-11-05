// 상품 검색
export function SearchProduct(products, searchQuery) {
  return products
    .filter(doc =>
      searchQuery.split(" ").length === 1
        ? doc.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.data.title.toUpperCase().includes(searchQuery.toUpperCase()) ||
          doc.data.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.data.sku.toUpperCase().includes(searchQuery.toUpperCase()) ||
          doc.data.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.data.barcode.toUpperCase().includes(searchQuery.toUpperCase())
        : searchQuery.split(" ").length === 2
        ? ((doc.data.title
            .toLowerCase()
            .includes(searchQuery.split(" ")[0].toLowerCase()) ||
            doc.data.title
              .toUpperCase()
              .includes(searchQuery.split(" ")[0].toUpperCase())) &&
            (doc.data.title
              .toLowerCase()
              .includes(searchQuery.split(" ")[1].toLowerCase()) ||
              doc.data.title
                .toUpperCase()
                .includes(searchQuery.split(" ")[1].toUpperCase()))) ||
          ((doc.data.sku
            .toLowerCase()
            .includes(searchQuery.split(" ")[0].toLowerCase()) ||
            doc.data.sku
              .toUpperCase()
              .includes(searchQuery.split(" ")[0].toUpperCase())) &&
            (doc.data.sku
              .toLowerCase()
              .includes(searchQuery.split(" ")[1].toLowerCase()) ||
              doc.data.sku
                .toUpperCase()
                .includes(searchQuery.split(" ")[1].toUpperCase()))) ||
          ((doc.data.barcode
            .toLowerCase()
            .includes(searchQuery.split(" ")[0].toLowerCase()) ||
            doc.data.barcode
              .toUpperCase()
              .includes(searchQuery.split(" ")[0].toUpperCase())) &&
            (doc.data.barcode
              .toLowerCase()
              .includes(searchQuery.split(" ")[1].toLowerCase()) ||
              doc.data.barcode
                .toUpperCase()
                .includes(searchQuery.split(" ")[1].toUpperCase())))
        : ""
    )
    .sort((a, b) => {
      return (
        new Date(b.data.preOrderDeadline.seconds) -
        new Date(a.data.preOrderDeadline.seconds)
      );
    });
}

// 주문 검색
export function SearchOrder(orders, searchQuery) {
  return orders.filter(
    doc =>
      doc.data.orderNumber.toLowerCase().includes(searchQuery.split(" ")[0]) ||
      doc.data.orderNumber.toLowerCase().includes(searchQuery.split(" ")[1]) ||
      doc.data.customer.toLowerCase().includes(searchQuery.split(" ")[0]) ||
      doc.data.customer.toLowerCase().includes(searchQuery.split(" ")[1]) ||
      doc.data.customer.toUpperCase().includes(searchQuery.split(" ")[0]) ||
      doc.data.customer.toUpperCase().includes(searchQuery.split(" ")[1]) ||
      doc?.data?.nickName?.toLowerCase().includes(searchQuery.split(" ")[0]) ||
      doc?.data?.nickName?.toLowerCase().includes(searchQuery.split(" ")[1]) ||
      doc?.data?.nickName?.toUpperCase().includes(searchQuery.split(" ")[0]) ||
      doc?.data?.nickName?.toUpperCase().includes(searchQuery.split(" ")[1])
  );
}
