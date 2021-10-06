import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import HiddenLists from "./HiddenLists";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect } from "react";
import { db } from "../../../firebase";

const OrderListRow = ({
  id,
  createdAt,
  customer,
  orderState,
  orderNumber,
  order,
  setCheckedAllItems,
  checkedAllItems,
  orders,
  hiddenAll,
  handelHiddenAll,
  nickName,
}) => {
  const history = useHistory();
  const today = new Date();

  // 상품삭제
  const handleDelete = () => {
    let con = window.confirm("정말로 삭제하시겠습니까?");
    if (con === true) {
      db.collection("orders")
        .doc("b2b")
        .collection("b2borders")
        .doc(id)
        .delete();
      window.location.replace("/orderlist");
    } else if (con === false) {
      return;
    }
  };

  // 아래에 숨겨진 목록 숨기고 열기 기능
  const [forHidden, setForHidden] = useState(true);
  const handleHidden = forHidden => {
    if (forHidden === true) {
      setForHidden(false);
      // handelHiddenAll(false);
    } else if (forHidden === false) {
      setForHidden(true);
      // handelHiddenAll(true);
    }
  };
  // 체크박스
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
      setCheckedAllItems([...checkedAllItems, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
      setCheckedAllItems(checkedAllItems.filter(el => el !== id));
    }
  };

  const idArray = [];
  const handleAllCheck = (checked, id) => {
    if (checked) {
      // 전체 체크 박스가 체크 되면 id를 가진 모든 elements를 배열에 넣어주어서,
      // 전체 체크 박스 체크
      order?.data?.list
        .filter(
          li =>
            li.moved === false && li.canceled === false && li.shipped === false
        )
        .forEach(el => idArray.push(el.childOrderNumber));
      setCheckedInputs(idArray);
      setCheckedAllItems([...checkedAllItems, ...idArray]);
    }

    // 반대의 경우 전체 체크 박스 체크 삭제
    else {
      setCheckedInputs([]);

      setCheckedAllItems(
        checkedAllItems.filter(el => !el.startsWith(id.trim()))
      );
    }
  };
  const included = order.data.list.reduce((i, c) => {
    if (c.moved === false && c.canceled === false && c.shipped === false) {
      return i || c.relDate.toDate() > today;
    }
    return i || false;
  }, false);
  // useEffect(() => {
  //   handleHidden(forHidden, hiddenAll);
  // }, [hiddenAll]);
  if (order) {
    return (
      <div className="border-b border-l border-r w-full border-black">
        <div
          className={`grid grid-cols-12 grid-flow-col text-center
        border-b py-1 items-center text-sm bg-white ${
          included ? " bg-red-100" : ""
        }`}
        >
          <div
            className="flex flex-row items-center justify-start
           "
          >
            <AddCircleOutlineIcon
              style={{ marginLeft: "10px" }}
              className="cursor-pointer"
              onClick={() => handleHidden(forHidden)}
            />
            <Link
              to={{
                pathname: "/invoice",
                state: checkedInputs,
                orders,
                order,
              }}
              // target="_blank"
            >
              <AssignmentOutlinedIcon />
            </Link>
            <LocalShippingOutlinedIcon />
            <DeleteIcon onClick={handleDelete} className="cursor-pointer" />
            <input
              type="checkbox"
              className=" ml-2"
              id={orderNumber}
              onChange={e =>
                handleAllCheck(e.currentTarget.checked, orderNumber)
              }
              checked={
                checkedInputs.length === order.data.list.length ? true : false
              }
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => history.push(`/orderdetail/${id}`)}
          >
            {orderNumber}
          </div>
          <div
            className="col-span-2 cursor-pointer"
            onClick={() => history.push(`/orderdetail/${id}`)}
          >
            {new Date(createdAt.toDate()).toLocaleString()}
          </div>
          <div
            className="col-span-2 cursor-pointer"
            onClick={() => history.push(`/orderdetail/${id}`)}
          >
            {nickName && nickName.length > 0 ? nickName : customer}
          </div>
          <div>{orderState} </div>
          <div>
            {order.data.currency === "KRW"
              ? order.data.totalPrice.toLocaleString("ko-KR")
              : order.data.totalPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
            {order.data.currency}
          </div>
          <div>
            {order.data.currency === "KRW"
              ? order.data.amountPrice.toLocaleString("ko-KR")
              : order.data.amountPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
            {order.data.currency}
          </div>
          <div>{order.data.list.length} type</div>
          <div>
            {order.data.list.reduce((i, c) => {
              return i + c.quan;
            }, 0)}{" "}
            EA
          </div>
          <div>
            {(
              order.data.list.reduce((i, c) => {
                return i + c.weight * c.quan;
              }, 0) / 1000
            ).toFixed(2)}{" "}
            KG
          </div>
        </div>
        {forHidden && hiddenAll ? (
          ""
        ) : (
          <HiddenLists
            order={order}
            checkedInputs={checkedInputs}
            changeHandler={changeHandler}
          />
        )}
      </div>
    );
  }

  return "loading";
};

export default OrderListRow;
