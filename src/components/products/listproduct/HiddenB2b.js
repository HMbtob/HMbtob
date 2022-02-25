import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import Modal from "../../modal/Modal";
import StockTable from "./StockTable";

const HiddenB2b = ({
  id,
  price,
  stock,
  relDate,
  // orders,
  // shippings,
  currency,
  // sku,
  product,
  orderListInShippings,
  op,
}) => {
  const [ordered, setOrdered] = useState([]);
  // const [shipped, setShipped] = useState([]);

  useEffect(() => {
    db.collectionGroup("order").onSnapshot((snapshot) =>
      setOrdered(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
    );

    // db.collectionGroup("orderListInShippings").onSnapshot(snapshot =>
    //   setShipped(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    // );
  }, []);
  // 총판매
  // // 총 미발송
  // console.log(
  //   "ordered",
  //   ordered
  //     .filter(doc => doc.data.productId === product.id)
  //     .reduce((a, c) => {
  //       return a + c.data.quan;
  //     }, 0)
  // );
  // console.log(
  //   "shipped",
  //   shipped
  //     .filter(doc => doc.data.productId === product.id)
  //     .reduce((a, c) => {
  //       return a + c.data.quan;
  //     }, 0)
  // );
  // const totalUnshipped = [].concat
  //   .apply(
  //     [],
  //     orders.map((order) =>
  //       order.data.list.filter(
  //         (arr) => arr.sku === sku && arr.canceled === false
  //       )
  //     )
  //   )
  //   .reduce((i, c) => {
  //     return i + c.quan;
  //   }, 0);
  // // // 총 발송
  // const totalshipped = [].concat
  //   .apply(
  //     [],
  //     shippings.map((shipping) =>
  //       shipping.data.list.filter((arr) => arr.sku === sku)
  //     )
  //   )
  //   .reduce((i, c) => {
  //     return i + c.quan;
  //   }, 0);

  // 재고수불부 모달
  const [forHidden, setForHidden] = useState(true);

  const handleHidden = (forHidden) => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    if (forHidden) {
      handleHidden(forHidden);
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  // const [stockHistory, setsStockHistory] = useState([]);
  // useEffect(() => {
  //   product.data.optioned &&
  //     db
  //       .collection("products")
  //       .doc(product.id)
  //       .collection("options")
  //       .doc(op.id)
  //       .collection("newStockHistory")
  //       .get()
  //       .then((snapshot) =>
  //         setsStockHistory(
  //           snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
  //         )
  //       );
  // }, []);

  // 간단 수정창 input 관리
  const [form, onChange] = useInputs({
    handlePrice: op ? op.data.optionPrice : price,
    handleStock: op ? op.data.optionStock : stock,
  });

  const { handlePrice, handleStock } = form;

  const simpleSave = async () => {
    if (op) {
      await db
        .collection("products")
        .doc(id)
        .collection("options")
        .doc(op.id)
        .update({
          optionPrice: Number(handlePrice),
          optionStock: Number(handleStock),
        });
      alert("수정됨");
      return;
    }
    await db
      .collection("products")
      .doc(id)
      .update({ price: Number(handlePrice), stock: Number(handleStock) });
    alert("수정됨");
  };
  return (
    <div
      className="grid grid-cols-36 items-center 
place-items-center text-xs bg-transparent border-t"
    >
      <button onClick={() => simpleSave()} className="col-span-2">
        b2b-수정
      </button>
      {product?.data?.optioned && (
        <button onClick={openModal}>
          <SyncAltIcon fontSize="small" style={{ color: "gray" }} />
        </button>
      )}
      <Modal open={modalOpen} close={closeModal} header={"재고수불부"}>
        <StockTable
          product={product}
          stockHistory={product?.data?.stockHistory}
          bigTotalSold={0}
          totalStock={0}
          id={id}
          option={product.data.optioned ? op : null}
        />
      </Modal>
      <div
        className={`col-span-${
          product.data.optioned ? "4" : "5"
        } flex flex-row justify-start w-full`}
      ></div>
      <div className="col-span-3"></div>
      <div className="col-span-2"></div>
      <div className="col-span-9 w-full">{op?.data.optionName}</div>
      <div className="col-span-3 flex flex-row items-center justify-center">
        <div>{currency}</div>

        <input
          type="number"
          className="col-span-2 border w-3/4 p-1 text-center"
          name="handlePrice"
          value={handlePrice}
          onChange={onChange}
        />
      </div>
      <div className="col-span-2"></div>
      <input
        type="number"
        className="col-span-2 border w-3/4 p-1 text-center"
        name="handleStock"
        value={handleStock}
        onChange={onChange}
      />

      <div className="col-span-1">
        {/* {totalUnshipped} */}
        {orderListInShippings
          .filter((doc) =>
            // op
            //   ? doc?.data?.optionName === op?.data?.name
            //   :
            doc.data.optioned === true
              ? doc.data.productId === product.id && doc.data.optionId === op.id
              : doc.data.productId === product.id
          )
          .reduce((a, c) => {
            return a + c.data.quan;
          }, 0) +
          ordered
            .filter((doc) =>
              doc.data.optioned === true
                ? doc.data.productId === product.id &&
                  doc.data.optionId === op.id
                : doc.data.productId === product.id
            )
            .reduce((a, c) => {
              return a + c.data.quan;
            }, 0)}{" "}
      </div>
      <div className="col-span-1">
        {/* {totalUnshipped - totalshipped}( */}

        {ordered
          .filter((doc) =>
            doc.data.optioned === true
              ? doc.data.productId === product.id && doc.data.optionId === op.id
              : doc.data.productId === product.id
          )
          .reduce((a, c) => {
            return a + c.data.quan;
          }, 0)}
        {/* ) */}
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-4 text-xs">
        {relDate &&
          new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
      </div>
    </div>
  );
};

export default HiddenB2b;
