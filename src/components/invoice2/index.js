import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router-dom";
import useInputs from "../../hooks/useInput";
import InvoiceRow from "../invoice/InvoiceRow";
import { db } from "../../firebase";

export function Invoice2({ location }) {
  const { shipping } = location;
  const [orderInshipping, setOrderInshipping] = useState([]);

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
    recipient: shipping.data.recipient || "",
    street: shipping.data.street || "",
    city: shipping.data.city || "",
    zipcode: shipping.data.zipcode || "",
    states: shipping.data.states || "",
    country: shipping.data.country || "",
    recipientEmail: shipping.data.recipientEmail || "",
  });

  const { recipient, street, city, zipcode, states, country, recipientEmail } =
    form;

  const [shippingFee, setShippingFee] = useState(
    shipping.data.currency === "KRW"
      ? Number(shipping.data.shippingFee)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(shipping.data.shippingFee)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handleShippingFee = (e) => {
    setShippingFee(
      shipping.data.currency === "KRW"
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
    shipping.data.currency === "KRW"
      ? Number(shipping.data.totalAmount)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : Number(shipping.data.totalAmount)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const handleAmountPrice = (e) => {
    setAmountPrice(
      shipping.data.currency === "KRW"
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

  useEffect(() => {
    db.collection("accounts")
      .doc(shipping.data.userId)
      .collection("shippingsInAccount")
      .doc(shipping.id)
      .collection("orderListInShippings")
      .onSnapshot((snapshot) =>
        setOrderInshipping(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
      );
  }, [shipping]);
  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div className="m-auto mt-12 w-11/12 ">
          <div className="w-full">
            <div className="text-left text-2xl font-semibold mb-5">INVOICE</div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-base font-semibold">Seller</div>
                <div className="text-sm">INTERASIA</div>
                <div className="text-sm">#417, 78 Digital-ro 10-gil</div>
                <div className="text-sm">Geumcheon-gu, Seoul, Korea</div>
                <div className="text-sm">Tel: +82 2 10 2088 0022</div>
                <div className="text-sm">Fax: +82 2 3281 0125</div>
              </div>
              <div className="w-1/3 flex flex-col justify-center text-sm">
                <div>
                  invoice No.: {shipping && shipping.data.shippingNumber}
                </div>
                <div>
                  invoice Date: {new Date().toLocaleString().substring(0, 10)}
                </div>
              </div>
            </div>
            <div className="flex-row flex w-full mb-5">
              <div className="w-2/3">
                <div className="text-base font-semibold">Consignee</div>
                {shipping && (
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
              <div className="bw-1/3  flex flex-col justify-center text-sm"></div>
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
            {orderInshipping &&
              orderInshipping
                .sort((a, b) => {
                  return a.data.title < b.data.title
                    ? -1
                    : a.data.title > b.data.title
                    ? 1
                    : 0;
                })
                .map((list, i) => (
                  <InvoiceRow key={i} list={list} index={i} from="new" />
                ))}
            <div
              className="grid grid-cols-28 text-center
             text-sm border-r border-l border-black border-b"
            >
              <div className="col-span-1  border-r border-black"></div>
              <div className="col-span-16 border-r border-black text-left pl-2 flex items-center">
                {shipping?.data?.shippingType?.toUpperCase() || "Shipping Fee"}
              </div>
              <div className="col-span-3 border-r border-black"></div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-3 border-r border-black"> </div>
              <div className="col-span-3 justify-center flex flex-row items-center w-full p-1">
                <input
                  disabled
                  className="w-full text-center text-sm outline-none "
                  type="text"
                  value={shippingFee}
                  name="shippingFee"
                  onChange={(e) => handleShippingFee(e)}
                />
                {shipping?.data?.currency}
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
                  disabled
                  className="text-center py-1 outline-none w-full"
                  type="text"
                  value={amountPrice}
                  name="amountPrice"
                  onChange={handleAmountPrice}
                />
                {shipping?.data?.currency}
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
    <div className="w-full flex flex-col justify-start items-center mt-20">
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
