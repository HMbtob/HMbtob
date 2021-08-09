import React, { useState } from "react";
import { useHistory } from "react-router";
import HiddenB2b from "./HiddenB2b";
import HiddenBigc from "./HiddenBigc";
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
  bigcProductId,
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
  return (
    <div className="border-b">
      <div
        className="grid grid-cols-28 items-center place-items-center 
        cursor-pointer text-sm p-1 bg-white"
        onClick={() => handleHidden(forHidden)}
      >
        <button
          className="col-span-2 bg-gray-500 px-2 py-1 rounded-md text-gray-200"
          onClick={() => history.push(`/detailproduct/${id}`)}
        >
          DETAIL
        </button>
        <div className="col-span-2">{sku}</div>
        <img className="col-span-2 h-10 rounded" src={thumbNail} alt={id} />
        <div className="col-span-10">{title}</div>
        <div className="col-span-2">{price}원</div>
        <div className="col-span-2">{stock}</div>
        <div className="col-span-2">{totalSell}</div>
        <div className="col-span-2">{unShipped}</div>
        <div className="col-span-2 text-xs">
          {new Date(relDate.toDate()).toLocaleDateString()}
        </div>

        <div className="col-span-2 text-xs">
          {new Date(preOrderDeadline.toDate()).toLocaleDateString()}
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
