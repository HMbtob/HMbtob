import React from "react";
import { useHistory } from "react-router";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useState } from "react";
import HiddenLists from "./HiddenLists";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import { Link } from "react-router-dom";

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
}) => {
  const history = useHistory();
  const today = new Date();

  // 아래에 숨겨진 목록 숨기고 열기 기능
  const [forHidden, setForHidden] = useState(true);
  const handleHidden = forHidden => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };
  // 체크박스
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
      setCheckedAllItems([...checkedAllItems, id]);
      console.log(checkedAllItems);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
      setCheckedAllItems(checkedAllItems.filter(el => el !== id));
      console.log(checkedAllItems);
    }
  };
  const idArray = [];

  const handleAllCheck = (checked, id) => {
    if (checked) {
      // 전체 체크 박스가 체크 되면 id를 가진 모든 elements를 배열에 넣어주어서,
      // 전체 체크 박스 체크
      order?.data?.list?.forEach(el => idArray.push(el.childOrderNumber));
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
  if (order) {
    return (
      <div className="border-b w-full">
        <div
          className={`grid grid-cols-12 grid-flow-col text-center
        border-b border-l border-r py-1 items-center text-sm bg-white ${
          included ? " bg-red-200" : ""
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
              <AssignmentOutlinedIcon
                onClick={() => console.log(checkedInputs)}
              />
            </Link>
            <LocalShippingOutlinedIcon />
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
            {customer}
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
            {order.data.list.reduce((i, c) => {
              return i + c.weight * c.quan;
            }, 0) / 1000}{" "}
            KG
          </div>
        </div>
        {forHidden ? (
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
