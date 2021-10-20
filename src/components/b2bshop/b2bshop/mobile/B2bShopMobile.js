import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { InitDataContext, InitDispatchContext } from "../../../../App";
import { useHistory } from "react-router";

import useSimpleList from "../../../../hooks/useSimpleList";
import SimpleList from "../../simplelist/SimpleList";

import MobileOrderButton from "./MobileOrderButton";
import MobileSearch from "./MobileSearch";
import MobileTable from "./MobileTable";

const B2bShopMobile = () => {
  const today = useMemo(() => new Date(), []);
  const history = useHistory();

  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { category, products, user, exchangeRate, orders } = state;

  // list toggle
  const [toggleSimpleList, setToggleSimpleList] = useState(false);
  const onSimpleListClick = () => {
    setToggleSimpleList(!toggleSimpleList);
  };

  // order number를 위한 0 포함된 숫자 만드는 함수
  const addZeros = (n, digits) => {
    let zero = "";
    n = n.toString();
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };
  // order number를 위한 마지막 3자리 숫자 만들기
  const forOrderNumber = orders
    ?.filter(order => order.data.customer === user?.email)
    .filter(
      order =>
        new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10) === new Date(today).toISOString().substring(0, 10)
    )
    ? orders
        .filter(order => order.data.customer === user?.email)
        .filter(
          order =>
            new Date(order.data.createdAt.seconds * 1000)
              .toISOString()
              .substring(0, 10) ===
            new Date(today).toISOString().substring(0, 10)
        ).length
    : 0;

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
  const handleClear = useCallback(
    e => {
      if (e) {
        e.preventDefault();
      }
      // 프리오더
      setInitProducts([
        {
          "Pre Order": products
            .filter(
              product =>
                new Date(product?.data?.preOrderDeadline?.seconds * 1000) >
                today
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
                new Date(product?.data?.preOrderDeadline?.seconds * 1000) <=
                today
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
                new Date(product?.data?.preOrderDeadline?.seconds * 1000) <=
                today
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
    },
    [products, today]
  );
  // {title(id):quan} 형태로 가져오기
  const [confirmChecked, setConfirmCheck] = useState(false);
  const [form, onChange, reset, deleteList] = useSimpleList(
    {},
    setConfirmCheck,
    products
  );
  // list 만들기
  let simpleList = useMemo(() => []);
  const handleCheck = useCallback(() => {
    if (simpleList.length > 0) {
      setConfirmCheck(true);
    } else if (simpleList.length === 0) {
      setConfirmCheck(false);
    }
  }, [simpleList]);
  if (form && products) {
    let i = 0;
    for (let key in form) {
      if (form[key]) {
        simpleList.push({
          exchangeRate,
          orderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}`,
          currency: user.currency,
          nickName: user.nickName,
          productId: key,
          title: products.find(product => product.id === key).data.title,
          quan: Number(form[key]),
          price:
            Number(
              (
                (products.find(product => product.id === key).data.price /
                  exchangeRate[user?.currency]) *
                  (1 -
                    user.dcRates[
                      products.find(product => product.id === key).data.category
                    ]) -
                user.dcAmount[
                  `${
                    products.find(product => product.id === key).data.category
                  }A`
                ]
              ).toFixed(2)
            ) || 0,
          totalPrice:
            Number(
              (products.find(product => product.id === key).data.price /
                exchangeRate[user?.currency]) *
                (1 -
                  user.dcRates[
                    products.find(product => product.id === key).data.category
                  ]) -
                user.dcAmount[
                  `${
                    products.find(product => product.id === key).data.category
                  }A`
                ]
            ).toFixed(2) * Number(form[key]) || 0,
          weight:
            Number(products.find(product => product.id === key).data.weight) ||
            0,
          totalWeight:
            Number(products.find(product => product.id === key).data.weight) *
              Number(form[key]) || 0,
          dcRate:
            Number(
              state.user.dcRates[
                products.find(product => product.id === key).data.category
              ]
            ) || 0,
          dcAmount:
            Number(
              state.user.dcAmount[
                products.find(product => product.id === key).data.category
              ]
            ) || 0,
          relDate:
            products.find(product => product.id === key).data.relDate || 0,
          preOrderDeadline:
            products.find(product => product.id === key).data
              .preOrderDeadline || 0,
          childOrderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}-${i + 1}`,
          moved: false,
          moveTo: "",
          canceled: false,
          shipped: false,
          createdAt: new Date(),
          barcode:
            products.find(product => product.id === key).data.barcode || "",
          sku: products.find(product => product.id === key).data.sku || "",
        });
        i++;
      }
    }
  }

  // b2b make order
  const B2bMakeOrder = async () => {
    // dispatch로 심플리스트 스테이트로 업데이트하고
    await dispatch({ type: "SIMPLELIST", simpleList });
    reset();
    history.push(`/b2border`);
  };

  useEffect(() => {
    handleCheck();
  }, [simpleList, handleCheck]);

  useEffect(() => {
    handleClear();
  }, [handleClear]);
  return (
    <div className="mt-10 bg-gray-100 h-auto min-h-screen flex-col flex items-center">
      {/* 검색창 */}
      <MobileSearch
        searchedProducts={searchedProducts}
        query={query}
        queryOnChange={queryOnChange}
        handleClear={handleClear}
        onSimpleListClick={onSimpleListClick}
        simpleListLength={simpleList.length}
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
          // list
          dispatch={dispatch}
          onChange={onChange}
          simpleList={simpleList}
        />
      ))}
      <MobileOrderButton
        B2bMakeOrder={B2bMakeOrder}
        simpleListLength={simpleList.length}
      />
      {toggleSimpleList && (
        <SimpleList
          exchangeRate={exchangeRate}
          confirmChecked={confirmChecked}
          simpleList={simpleList && simpleList}
          dispatch={dispatch}
          // B2bMakeOrder={B2bMakeOrder}
          state={state}
          onChange={onChange}
          deleteList={deleteList}
        />
      )}
    </div>
  );
};

export default B2bShopMobile;
