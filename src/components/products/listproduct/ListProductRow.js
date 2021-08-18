import React, { useState } from "react";
import { useHistory } from "react-router";
import Modal from "../../modal/Modal";
import HiddenB2b from "./HiddenB2b";
import HiddenBigc from "./HiddenBigc";
import StockTable from "./StockTable";
import BuildIcon from "@material-ui/icons/Build";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import CommentIcon from "@material-ui/icons/Comment";
import ProductMemo from "./ProductMemo";
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
  product,
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
  // 재고수불부 모달
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  //상품별 메모 모달
  const [modalOpen2, setModalOpen2] = useState(false);

  const openModal2 = () => {
    setModalOpen2(true);
  };
  const closeModal2 = () => {
    setModalOpen2(false);
  };

  return (
    <div className="border-b w-full">
      <div
        className="grid grid-cols-36 items-center place-items-center 
        text-xs bg-white w-full"
      >
        <div className="col-span-4 flex flex-row justify-evenly w-full items-center">
          {/* 메모 아이콘 */}
          <CommentIcon
            className="cursor-pointer"
            onClick={openModal2}
            fontSize="small"
            style={{ color: "gray" }}
          />
          <Modal open={modalOpen2} close={closeModal2} header={"상품 메모"}>
            <ProductMemo
              productMemo={product.data.productMemo}
              id={id}
              user={user}
            />
          </Modal>
          {/* 디테일수정 아이콘 */}
          <button onClick={() => history.push(`/detailproduct/${id}`)}>
            <BuildIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          {/* 재고수불부 아이콘 */}
          <button onClick={openModal}>
            <SyncAltIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          <Modal open={modalOpen} close={closeModal} header={"재고수불부"}>
            <StockTable />
          </Modal>
        </div>

        <div className="col-span-3">{barcode}</div>
        <div className="col-span-3">{sku}</div>
        <img className="col-span-2 h-8 rounded-sm " src={thumbNail} alt="" />
        <div
          className="col-span-14 cursor-pointer text-left w-full flex flex-row items-center"
          onClick={() => handleHidden(forHidden)}
        >
          <div> {title}</div>
        </div>
        <div className="col-span-2">
          {exchangeRate[user?.currency] === 1
            ? (price / exchangeRate[user?.currency])?.toLocaleString("ko-KR")
            : (price / exchangeRate[user?.currency])
                ?.toFixed(2)
                ?.toLocaleString("ko-KR")}{" "}
          {user.currency}
        </div>
        <div className="col-span-2">{stock?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2">{totalSell?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2">{unShipped?.toLocaleString("ko-KR")}</div>
        <div className="col-span-2 text-xs">
          {relDate &&
            new Date(relDate.seconds * 1000).toISOString().substring(0, 10)}
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
            product={product}
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
