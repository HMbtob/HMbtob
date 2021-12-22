import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { krwComma } from "../../../utils/shippingUtils";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
export function OrderListDetailRow({
  order,
  register,
  checkAll,
  setValue,
  checkAllReled,
  checkPickingUp,
}) {
  const today = new Date();
  const preOrder = order.data.relDate.toDate() < today;

  const [price, setPrice] = useState(order.data.price);
  const [qty, setQty] = useState(order.data.quan);

  const saveDetail = () => {
    try {
      db.collection("accounts")
        .doc(order.data.customer || order.data.userId)
        .collection("order")
        .doc(order.id)
        .update({
          price: Number(price),
          quan: Number(qty),
          totalPrice: Number(price) * Number(qty),
        });
      alert("수정되었습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  const deleteOrder = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await db
          .collection("accounts")
          .doc(order.data.customer || order.data.userId)
          .collection("order")
          .doc(order.id)
          .update({ canceled: true });
        alert("삭제되었습니다.");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pickingUpOrder = async () => {
    try {
      await db
        .collection("accounts")
        .doc(order.data.customer || order.data.userId)
        .collection("order")
        .doc(order.id)
        .update({ pickingUp: !order.data.pickingUp });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!order.data.canceled) {
      if (checkAllReled && preOrder) {
        setValue(order.id, checkAllReled);
      } else if (checkPickingUp && order.data.pickingUp === true) {
        setValue(order.id, checkPickingUp);
      } else {
        setValue(order.id, checkAll);
      }
    }
  }, [
    setValue,
    order.id,
    checkAll,
    order.data.canceled,
    checkAllReled,
    preOrder,
    checkPickingUp,
    order.data.pickingUp,
  ]);

  return (
    <div
      className={`${
        !preOrder ? "bg-red-100" : ""
      } grid grid-cols-36 text-center border-r border-b border-l py-1 text-sm items-center ${
        order.data.canceled && "line-through"
      }`}
    >
      <div>
        <input
          {...register(`${order.id}`)}
          type="checkbox"
          disabled={order.data.canceled}
        />
      </div>
      <div className="col-span-3">{order.data.country}</div>
      <div className="col-span-2">
        {new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-2">
        {new Date(order.data.relDate.seconds * 1000)
          .toISOString()
          .substring(0, 10)}
      </div>
      <div className="col-span-3">{order.data.sku}</div>
      <div className="col-span-3">{order.data.barcode}</div>
      <div className="col-span-10 flex flex-row items-center justify-between">
        <div className="text-left">
          {!order.data.pickingUp ? (
            <FileDownloadIcon
              onClick={() => pickingUpOrder()}
              style={{ color: "gray" }}
              className="cursor-pointer ml-2"
            />
          ) : (
            <FileUploadIcon
              onClick={() => pickingUpOrder()}
              style={{ color: "gray" }}
              className="cursor-pointer ml-2"
            />
          )}
          <CheckCircleOutlineIcon
            style={{ color: `${order.data.confirmed ? "green" : "red"}` }}
          />
          {order.data.title}
          <DeleteIcon
            style={{ color: "gray" }}
            onClick={() => deleteOrder()}
            className="cursor-pointer"
          />
        </div>
        <button
          type="button"
          disabled={order.data.canceled}
          onClick={() => saveDetail()}
          className={`${
            order.data.canceled ? "bg-gray-400" : "bg-blue-900"
          } rounded-md  py-1 px-2 text-white`}
        >
          수정
        </button>{" "}
      </div>
      <div className="col-span-3 flex flex-row justify-center items-center">
        {/* {Number(order.data.price).toLocaleString()} {} */}
        <input
          type="text"
          value={krwComma(price, order.data.currency)}
          onChange={e => {
            const { value } = e.target;
            const onlyNumber = value.replace(/[^0-9]/g, "");
            setPrice(onlyNumber);
          }}
          className="w-2/3 text-right pr-2 border outline-none"
        />
        {order.data.currency}
      </div>
      <div className="flex flex-row justify-center col-span-2 items-center">
        <input
          type="number"
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="w-2/3 text-right pr-2 border outline-none"
        />{" "}
        {/* {order.data.quan}  */}
        ea
      </div>
      <div className="col-span-3">
        {Number(order.data.totalPrice).toLocaleString()} {order.data.currency}
      </div>
      <div className="col-span-4 text-left">{order?.data?.memo}</div>
    </div>
  );
}
