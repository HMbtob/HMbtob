import React, { useContext, useEffect, useState } from "react";
import { InitDataContext, InitDispatchContext } from "../../../../App";

import MobileOrderButton from "./MobileOrderButton";
import MobileSearch from "./MobileSearch";
import MobileTable from "./MobileTable";

const B2bShopMobile = () => {
  const today = new Date();
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { category, notices, products, user, exchangeRate, orders, rooms } =
    state;

  const [initProducts, setInitProducts] = useState([]);
  // (common) Products 카테고리 설정
  const selectCat = e => {
    const { id } = e.target;
    dispatch({ type: "CATEGORY", category: id });
  };

  const categories = [
    { cd: "cd" },
    { dvdBlueRay: "dvd/blue-ray" },
    { photoBook: "photo book" },
    { goods: "goods/magazine" },
    { officialStore: "official store" },
    { beauty: "beauty" },
  ];

  // 검색기능
  const [query, setQuery] = useState();
  const queryOnChange = e => {
    const { value } = e.target;
    setQuery(value);
  };

  // 검색하기 버튼
  // 세 상품이 겹치면 안됨
  // 프리오더 상품
  const searchedProducts = e => {
    e.preventDefault();
    setInitProducts([
      {
        "Pre Order": products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
          )
          .filter(doc => doc.data.exposeToB2b === "노출")
          .filter(doc =>
            query.split(" ").length === 1
              ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.barcode.toUpperCase().includes(query.toUpperCase())
              : query.split(" ").length === 2
              ? ((doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.title
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.title
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.sku
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.sku
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.barcode
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.barcode
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase())))
              : ""
          )
          .sort((a, b) => {
            return (
              new Date(a.data.preOrderDeadline.seconds) -
              new Date(b.data.preOrderDeadline.seconds)
            );
          }),
      },
      {
        "Hot Deal": products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
          )
          .filter(doc => doc.data.exposeToB2b === "DEAL")
          .filter(doc =>
            query.split(" ").length === 1
              ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.barcode.toUpperCase().includes(query.toUpperCase())
              : query.split(" ").length === 2
              ? ((doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.title
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.title
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.sku
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.sku
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.barcode
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.barcode
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase())))
              : ""
          )
          .sort((a, b) => {
            return (
              new Date(b.data.relDate.seconds) -
              new Date(a.data.relDate.seconds)
            );
          }),
      },
      {
        Products: products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
          )
          .filter(doc => doc.data.exposeToB2b === "노출")
          .filter(doc =>
            query.split(" ").length === 1
              ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
                doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
                doc.data.barcode.toUpperCase().includes(query.toUpperCase())
              : query.split(" ").length === 2
              ? ((doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.title
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.title
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.sku
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.sku
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase()))) ||
                ((doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[0].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[0].toUpperCase())) &&
                  (doc.data.barcode
                    .toLowerCase()
                    .includes(query.split(" ")[1].toLowerCase()) ||
                    doc.data.barcode
                      .toUpperCase()
                      .includes(query.split(" ")[1].toUpperCase())))
              : ""
          )
          .sort((a, b) => {
            return (
              new Date(b.data.relDate.seconds) -
              new Date(a.data.relDate.seconds)
            );
          }),
      },
    ]);
  };

  // 초기화
  const handleClear = e => {
    if (e) {
      e.preventDefault();
    }
    // 프리오더
    setInitProducts([
      {
        "Pre Order": products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
          )
          .filter(doc => doc.data.exposeToB2b === "노출")
          .sort((a, b) => {
            return (
              new Date(a.data.preOrderDeadline.seconds) -
              new Date(b.data.preOrderDeadline.seconds)
            );
          }),
      },
      {
        "Hot Deal": products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
          )
          .filter(doc => doc.data.exposeToB2b === "DEAL")
          .sort((a, b) => {
            return (
              new Date(b.data.relDate.seconds) -
              new Date(a.data.relDate.seconds)
            );
          }),
      },
      {
        Products: products
          .filter(
            product =>
              new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
          )
          .filter(doc => doc.data.exposeToB2b === "노출")
          .sort((a, b) => {
            return (
              new Date(b.data.relDate.seconds) -
              new Date(a.data.relDate.seconds)
            );
          }),
      },
    ]);
  };
  useEffect(() => {
    handleClear();
  }, []);
  return (
    <div className="mt-10 bg-gray-100 h-auto min-h-screen flex-col flex items-center">
      {/* 검색창 */}
      <MobileSearch
        searchedProducts={searchedProducts}
        query={query}
        queryOnChange={queryOnChange}
        handleClear={handleClear}
      />
      {/* pre order table */}
      {initProducts.map((product, i) => (
        <MobileTable
          key={i}
          header={Object.keys(product)[0]}
          user={user}
          exchangeRate={exchangeRate}
          filteredProducts={Object.values(product)[0]}
          // (common) Products 카테고리
          selectCat={selectCat}
          categories={categories}
          category={category}
        />
      ))}
      <MobileOrderButton />
    </div>
  );
};

export default B2bShopMobile;
