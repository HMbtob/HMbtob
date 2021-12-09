import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export function PickUpList2({ location }) {
  const { state, orders } = location;
  const [pickUpLists] = useState(
    [].concat.apply(
      [],
      orders.map(order =>
        order.data.list.filter(
          list =>
            state.includes(list.childOrderNumber) &&
            list.canceled === false &&
            list.moved === false &&
            list.shipped === false
        )
      )
    )
  );
  const history = useHistory();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const printGoback = () => {
    handlePrint();
    history.goBack();
  };
  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div className="m-auto mt-10 w-11/12 ">
          <div className="">
            <div className="text-center text-xl">Pick Up List</div>

            <div
              className="grid grid-cols-20 border text-center
               bg-gray-700 text-white"
            >
              <div className="col-span-1">no.</div>
              <div className="col-span-3">Order Num</div>
              <div className="col-span-3">bar</div>
              <div className="col-span-8">title</div>
              <div className="col-span-4">ver</div>
              <div className="col-span-1">qty</div>
            </div>

            {pickUpLists &&
              pickUpLists
                .sort((a, b) => {
                  return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
                })
                .map((list, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-20 border-b
                 border-r border-l text-sm p-1"
                  >
                    <div className="col-span-1 text-center">{i + 1}</div>
                    <div className="col-span-3 text-center">
                      {list.orderNumber}
                    </div>
                    <div className="col-span-3 text-center">{list.sku}</div>
                    <div className="col-span-8 text-left">{list.title}</div>
                    <div className="col-span-4"></div>
                    <div className="col-span-1 text-center">{list.quan}</div>
                  </div>
                ))}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full flex flex-col justify-start items-center">
      <button
        onClick={printGoback}
        className="mt-10 bg-gray-800
        text-white w-40 py-1 px-4 rounded"
      >
        {" "}
        인쇄하기
      </button>
      <ComponentToPrint ref={componentRef} />
    </div>
  );
}
