import React, { useState } from "react";
import { useHistory } from "react-router";
import Modal from "../../modal/Modal";
import HiddenB2b from "./HiddenB2b";
import HiddenBigc from "./HiddenBigc";
import StockTable from "./StockTable";
const ListProductRow = ({
  id,
  sku,
  thumbNail,
  title,
  price,
  stock,
  totalSell,
  unShipped,
  relDate,
  preOrderDeadline,
  orders,
  shippings,
  barcode,
  bigcProductId,
  user,
  exchangeRate,
}) => {
  const history = useHistory();
  const [forHidden, setForHidden] = useState(true);
  const handleHidden = forHidden => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="border-b">
      <div
        className="grid grid-cols-36 items-center place-items-center 
        text-xs bg-white"
      >
        <div className="col-span-2 flex flex-row justify-evenly w-full">
          <button>🎁</button>
          <button onClick={() => history.push(`/detailproduct/${id}`)}>
            ⚒
          </button>
          <button onClick={openModal}>📦</button>
        </div>
        <Modal open={modalOpen} close={closeModal} header={"재고수불부"}>
          <StockTable />
        </Modal>

        <div className="col-span-3">{barcode}</div>
        <div className="col-span-3">{sku}</div>
        <img className="col-span-2 h-8 rounded-sm " src={thumbNail} alt="" />
        <div
          className="col-span-14 cursor-pointer text-left w-full"
          onClick={() => handleHidden(forHidden)}
        >
          {title}
        </div>
        <div className="col-span-2">
          {(price / exchangeRate[user?.currency])
            ?.toFixed(2)
            .toLocaleString("ko-KR")}{" "}
          {user.currency}
        </div>
        <div className="col-span-2">{stock?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2">{totalSell?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2">{unShipped?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2 text-xs">
          {relDate &&
            new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
        </div>
        <div className="col-span-2 text-xs">
          {preOrderDeadline &&
            new Date(preOrderDeadline.seconds * 1000)
              .toISOString()
              .substring(0, 10)}
        </div>
      </div>
      {forHidden ? (
        ""
      ) : (
        <>
          <HiddenB2b
            id={id}
            sku={sku}
            thumbNail={thumbNail}
            title={title}
            price={price}
            stock={stock}
            totalSell={totalSell}
            unShipped={unShipped}
            relDate={relDate}
            preOrderDeadline={preOrderDeadline}
            orders={orders}
            shippings={shippings}
          />
          <HiddenBigc
            id={id}
            sku={sku}
            thumbNail={thumbNail}
            title={title}
            price={price}
            stock={stock}
            totalSell={totalSell}
            unShipped={unShipped}
            relDate={relDate}
            preOrderDeadline={preOrderDeadline}
            orders={orders}
            shippings={shippings}
            bigcProductId={bigcProductId}
          />
        </>
      )}
    </div>
  );
};

export default ListProductRow;
