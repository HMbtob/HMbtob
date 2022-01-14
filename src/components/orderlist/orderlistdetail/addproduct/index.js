import React, { useEffect } from "react";
import { useState } from "react";
import { db } from "../../../../firebase";
export function AddProduct({ id, add }) {
  const AddProductRow = React.lazy(() =>
    import("./AddProductRow").then(module => ({
      default: module.AddProductRow,
    }))
  );

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(null);
  const [user, setUser] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  function toLocalCurrency(price, user, exchangeRate) {
    if (exchangeRate[user.currency] === 1) {
      return (price / exchangeRate[user.currency])?.toLocaleString("ko-KR");
    } else {
      return (price / exchangeRate[user.currency])
        ?.toFixed(2)
        ?.toLocaleString();
    }
  }
  function toSalePriceToLocaleCurrency(price, user, exchangeRate, category) {
    if (exchangeRate[user.currency] === 1) {
      return Number(
        (price -
          price * user.dcRates[category] -
          user.dcAmount[`${category}A`]) /
          exchangeRate[user.currency]
      );
    } else {
      return Number(
        (
          (price -
            (price * user.dcRates[category] - user.dcAmount[`${category}A`])) /
          exchangeRate[user.currency]
        ).toFixed(2)
      );
    }
  }
  const searchProduct = async () => {
    const products = [];
    await db
      .collection("products")
      .where("exposeToB2b", "==", "노출")
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshot =>
        snapshot.forEach(doc => products.push({ id: doc.id, data: doc.data() }))
      );
    setSearched(
      products.filter(doc =>
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
          : null
      )
    );
  };

  const addOrder = async (product, add, price, qty, memo, user) => {
    const today = new Date();
    if (qty < 1 || qty === 0 || qty === "") {
      alert("올바른 수량을 입력해 주세요.");
      return;
    }
    try {
      if (add.data.country.length === 0) {
        if (
          window.confirm(
            "배송지가 설정되있지 않습니다. 미국 기준으로 배송지를 설정하시겠습니까?"
          )
        ) {
          await db
            .collection("accounts")
            .doc(id)
            .collection("order")
            .doc()
            .set({
              ...add.data,
              ...product.data,
              addName: add.data.name,
              userId: id,
              country: "USA (US)",
              userUid: user.data.uid,
              currency: user.data.currency,
              createdAt: today,
              exchangeRate: exchangeRate,
              canceled: false,
              dcAmount: user.data.dcAmount[`${product.data.category}A`],
              dcRate: user.data.dcRates[product.data.category],
              nickName: user.data.nickName,
              price: price,
              productId: product.id,
              quan: qty,
              shipped: false,
              title: product.data.title.trim(),
              totalPrice: price * qty,
              totalWeight: product.data.weight * qty,
              memo: memo,
            });
          alert("주문이 추가되었습니다.");
        }
      } else {
        await db
          .collection("accounts")
          .doc(id)
          .collection("order")
          .doc()
          .set({
            ...add.data,
            ...product.data,
            addName: add.data.name,
            userId: id,
            userUid: user.data.uid,
            currency: user.data.currency,
            createdAt: today,
            exchangeRate: exchangeRate,
            canceled: false,
            dcAmount: user.data.dcAmount[`${product.data.category}A`],
            dcRate: user.data.dcRates[product.data.category],
            nickName: user.data.nickName,
            price: price,
            productId: product.id,
            quan: qty,
            shipped: false,
            title: product.data.title.trim(),
            totalPrice: price * qty,
            totalWeight: product.data.weight * qty,
            memo: memo,
          });
        alert("주문이 추가되었습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .onSnapshot(snapshot =>
        setUser({ id: snapshot.id, data: snapshot.data() })
      );
    db.collection("exchangeRate")
      .doc("rates")
      .onSnapshot(snapshot =>
        setExchangeRate({ id: snapshot.id, data: snapshot.data() })
      );
  }, [id]);
  return (
    <div className="mb-12 flex flex-col justify-center">
      <div className="flex flex-row justify-center mb-5">
        <input
          className=" text-lg py-2 px-3 mr-5 border outline-none w-80"
          placeholder="검색 후 추가"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={() => searchProduct()}
          className=" bg-blue-800 text-white px-3 mr-5 rounded-md font-semibold"
        >
          검색
        </button>
        <button
          className=" bg-blue-800 text-white px-3 mr-5 rounded-md font-semibold"
          type="button"
          onClick={() => {
            setSearched(null);
            setQuery("");
          }}
        >
          초기화
        </button>
      </div>

      {searched &&
        searched.map((product, i) => (
          <React.Suspense key={i} fallback={<div>Loading...</div>}>
            <AddProductRow
              product={product}
              user={user}
              exchangeRate={exchangeRate.data}
              add={add}
              addOrder={addOrder}
              toLocalCurrency={toLocalCurrency}
              toSalePriceToLocaleCurrency={toSalePriceToLocaleCurrency}
            />
          </React.Suspense>
        ))}
    </div>
  );
}
