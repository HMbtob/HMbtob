import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router";

const PickUpList = ({ location }) => {
  const { state, orders, order } = location;

  console.log(order);
  const [invoiceLists] = useState(
    [].concat.apply(
      [],
      orders.map(order =>
        order.data.list.filter(list => state.includes(list.childOrderNumber))
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
          <div className="w-full">
            <div className="text-left text-2xl font-semibold mb-5">INVOICE</div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-lg font-semibold">Seller</div>
                <div>INTERASIA</div>
                <div>#417, 78 Digital-ro 10-gil</div>
                <div>Geumcheon-gu, Seoul, Korea</div>
                <div>Tel: +82 2 10 2088 0022</div>
                <div>Fax: +82 2 3281 0125</div>
              </div>
              <div className="w-1/3 flex flex-col justify-center">
                <div>invoice No.:</div>
                <div>invoice Date:</div>
              </div>
            </div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-lg font-semibold">Consignee</div>
                {order && (
                  <>
                    <div>{order.data.recipient}</div>
                    <div>{order.data.street}</div>
                    <div>{order.data.city}</div>
                    <div>
                      {order.data.zipcode}, {order.data.states},
                      {order.data.country}
                    </div>
                    <div>{order.data.recipientEmail}</div>
                  </>
                )}
              </div>
              <div className="bw-1/3  flex flex-col justify-center">
                <div>Shipping :</div>
                <div>Tracking No.:</div>
              </div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             bg-gray-700 text-white text-base"
            >
              <div className="col-span-1">no.</div>
              <div className="col-span-18">Description of goods</div>
              <div className="col-span-3">Option</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit price</div>
              <div className="col-span-2">Amount</div>
            </div>

            {invoiceLists &&
              invoiceLists
                .sort((a, b) => {
                  return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
                })
                .map((list, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-28 border-b border-black
               border-r border-l text-xs"
                  >
                    <div className="col-span-1 text-center border-r border-black p-1">
                      {i + 1}
                    </div>
                    <div className="col-span-18 text-left  border-r border-black p-1">
                      {list.title}
                    </div>
                    <div className="col-span-3 text-center  border-r border-black p-1"></div>
                    <div className="col-span-2 text-center  border-r border-black p-1">
                      {list.quan} EA
                    </div>
                    <div className="col-span-2 text-center  border-r border-black p-1">
                      {list.price} {list.currency}
                    </div>
                    <div className="col-span-2 text-center p-1">
                      {list.totalPrice} {list.currency}
                    </div>
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
};

export default PickUpList;
