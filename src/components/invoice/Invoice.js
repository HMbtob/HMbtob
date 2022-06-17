import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router-dom";
import useInputs from "./../../hooks/useInput";
import InvoiceRow from "./InvoiceRow";

const PickUpList = ({ location }) => {
  const { state, orders, order } = location;
  const [invoiceLists] = useState(
    [].concat.apply(
      [],
      orders.map((order) =>
        order.data.list.filter(
          (list) =>
            state.includes(list.childOrderNumber) &&
            list.canceled === false &&
            list.moved === false
          // &&
          // list.shipped === false
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

  const [form, onchange] = useInputs({
    recipient: order.data.recipient,
    street: order.data.street,
    city: order.data.city,
    zipcode: order.data.zipcode,
    states: order.data.states,
    country: order.data.country,
    recipientEmail: order.data.recipientEmail,
    // shippingFee: order.data.shippingFee,
    // amountPrice: order.data.amountPrice,
  });

  const {
    recipient,
    street,
    city,
    zipcode,
    states,
    country,
    recipientEmail,
    // shippingFee,
    // amountPrice,
  } = form;

  const [shippingFee, setShippingFee] = useState(
    order.data.currency === "KRW"
      ? Number(order.data.shippingFee)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(order.data.shippingFee)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handleShippingFee = (e) => {
    setShippingFee(
      order.data.currency === "KRW"
        ? Number(e.target.value.replaceAll(",", ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(e.target.value.replaceAll(",", ""))
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  const [amountPrice, setAmountPrice] = useState(
    order.data.currency === "KRW"
      ? Number(order.data.amountPrice)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(order.data.amountPrice)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handleAmountPrice = (e) => {
    setAmountPrice(
      order.data.currency === "KRW"
        ? Number(e.target.value.replaceAll(",", ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : Number(e.target.value.replaceAll(",", ""))
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };
  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div className="m-auto mt-20 w-11/12 ">
          <div className="w-full">
            <div className="text-left text-2xl font-semibold mb-5">INVOICE</div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-base font-semibold">Seller</div>
                <div className="text-sm">HMcompany</div>
                <div className="text-sm">71, Bukhang-ro 207beon-gil</div>
                <div className="text-sm">Seo-gu, Incheon, Korea, 22856 </div>
                <div className="text-sm">Tel: +82 2 010 5788 7679</div>
              </div>
              <div className="w-1/3 flex flex-col justify-center text-sm">
                <div>invoice No.: {order && order.data.orderNumber}</div>
                <div>
                  invoice Date: {new Date().toLocaleString().substring(0, 14)}
                </div>
              </div>
            </div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-base font-semibold">Consignee</div>
                {order && (
                  <>
                    <div className="flex flex-col w-40 text-sm">
                      <input
                        className="   outline-none"
                        type="text"
                        value={recipient}
                        name="recipient"
                        onChange={onchange}
                      />
                      <input
                        className="   outline-none"
                        type="text"
                        value={street}
                        name="street"
                        onChange={onchange}
                      />
                      <input
                        className="   outline-none"
                        type="text"
                        value={city}
                        name="city"
                        onChange={onchange}
                      />
                    </div>
                    <div className="text-sm">
                      <input
                        className="  w-20 outline-none "
                        type="text"
                        value={zipcode}
                        name="zipcode"
                        onChange={onchange}
                      />
                      ,
                      <input
                        className="  w-24 outline-none"
                        type="text"
                        value={states}
                        name="states"
                        onChange={onchange}
                      />
                      ,
                      <input
                        className="  w-28 outline-none"
                        type="text"
                        value={country}
                        name="country"
                        onChange={onchange}
                      />
                    </div>
                    <input
                      className=" w-80 outline-none text-sm"
                      type="text"
                      value={recipientEmail}
                      name="recipientEmail"
                      onChange={onchange}
                    />
                  </>
                )}
              </div>
              <div className="bw-1/3  flex flex-col justify-center text-sm">
                {/* <div>Shipping :</div>
                <div>Tracking No.:</div> */}
              </div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             bg-gray-700 text-white text-sm"
            >
              <div className="col-span-1">no.</div>
              <div className="col-span-16">Description of goods</div>
              <div className="col-span-3">Option</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3">Unit price</div>
              <div className="col-span-3">Amount</div>
            </div>

            {invoiceLists &&
              invoiceLists
                .sort((a, b) => {
                  return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
                })
                .map((list, i) => <InvoiceRow key={i} list={list} index={i} />)}
            <div
              className="grid grid-cols-28 text-center
             text-sm border-r border-l border-black border-b"
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black text-left pl-2 flex items-center">
                {order?.data.shippingType.toUpperCase()}
              </div>
              <div className="col-span-3 border-r border-black"></div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"> </div>
              <div className="col-span-3 justify-center flex flex-row items-center w-full p-1">
                <input
                  className="w-full text-center text-sm outline-none "
                  type="text"
                  value={shippingFee}
                  name="shippingFee"
                  onChange={handleShippingFee}
                />
                {order?.data.currency}
              </div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-base border-r border-l border-black text-gray-50 border-b"
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black"></div>
              <div className="col-span-3 border-r border-black">a</div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"> </div>
              <div className="col-span-2"></div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-base border-r border-l border-black text-gray-50 border-b"
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black"></div>
              <div className="col-span-3 border-r border-black">a</div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"> </div>
              <div className="col-span-3"></div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-base border-r border-l border-black text-gray-50 border-b"
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black"></div>
              <div className="col-span-3 border-r border-black">a</div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"> </div>
              <div className="col-span-3"></div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-sm border-r border-l border-black "
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black p-1 font-semibold  text-left pl-2">
                Total Amount in{" "}
              </div>
              <div className="col-span-3 border-r border-black"></div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"></div>
              <div className="col-span-3 flex flex-row items-center justify-center w-full">
                <input
                  className="text-center py-1 outline-none w-full"
                  type="text"
                  value={amountPrice}
                  name="amountPrice"
                  onChange={handleAmountPrice}
                />
                {order?.data.currency}
              </div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-lg font-semibold border border-black"
            >
              <div className="col-span-20 border-r border-black p-1">
                {"Declaration of origin"}
              </div>
              <div className="col-span-8 p-1">{"Date & Company Chop"}</div>
            </div>
            <div
              className="grid grid-cols-28 text-center
             text-lg font-semibold border border-black h-48"
            >
              <div className="col-span-20 border-r border-black p-12">
                {"We the undersigned, the exporter of the products, "}
                {
                  "covered by this document, declare that, except where otherwise"
                }
                {
                  "clearly indicated, these products are of South Korea preferntial origin."
                }
              </div>
              <div className="col-span-8 flex- flex-col">
                <div className=" h-36"></div>
                <div className="border-t border-black p-2">INTERASIA</div>
              </div>
            </div>
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
