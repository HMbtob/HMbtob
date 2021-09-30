import React, { useContext, useState } from "react";
import firebase from "firebase";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import DaumPostcode from "react-daum-postcode";

const B2bOrder = () => {
  const state = useContext(InitDataContext);
  const history = useHistory();
  const today = new Date();
  const { user, simpleLists, products, dhlShippingFee, exchangeRate, orders } =
    state;
  const { z } = dhlShippingFee;

  // daum 주소 api

  // order number를 위한 0 포함된 숫자 만드는 함수
  const addZeros = (n, digits) => {
    let zero = "";
    n = n.toString();
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };

  // order number를 위한 마지막 3자리 숫자 만들기
  const forOrderNumber = orders
    .filter(order => order.data.customer === user.email)
    .filter(
      order =>
        new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10) === new Date(today).toISOString().substring(0, 10)
    )
    ? orders
        .filter(order => order.data.customer === user.email)
        .filter(
          order =>
            new Date(order.data.createdAt.seconds * 1000)
              .toISOString()
              .substring(0, 10) ===
            new Date(today).toISOString().substring(0, 10)
        ).length
    : 0;

  // 배송국가 전체 for select option
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );

  // 약관 체크
  const [confirmChecked, setConfirmCheck] = useState(false);

  const checkHandler = e => {
    const { checked } = e.target;
    if (checked) {
      setConfirmCheck(true);
    } else {
      setConfirmCheck(false);
    }
  };
  // 한국배송 체크
  const [shipToKoreaChecked, setShipToKoreaCheck] = useState(false);

  const shipToKoreaHandler = e => {
    const { checked } = e.target;
    if (checked) {
      setShipToKoreaCheck(true);
    } else {
      setShipToKoreaCheck(false);
    }
  };
  //  인풋
  const [form, onChange, reset] = useInputs({
    recipient: user?.recipient,
    street: user?.street,
    city: user?.city,
    states: user?.states,
    country: user?.country,
    recipientPhoneNumber: user?.recipientPhoneNumber,
    recipientEmail: user?.recipientEmail,
    shippingMessage: user?.shippingMessage,
    paymentMethod: "",
    shippingType: "",
    orderEmail: user?.email,
    taxId: user?.taxId,
    companyName: user?.companyName,
  });

  const {
    recipient,
    street,
    city,
    states,
    country,
    recipientPhoneNumber,
    recipientEmail,
    shippingMessage,
    paymentMethod,
    shippingType,
    taxId,
    companyName,
  } = form;
  const { orderEmail } = form;

  const [address, setaddress] = useState(user?.address || "");
  const [detailAddress, setdetailAddress] = useState(user?.detailAddress || "");
  const [zipcode, setZipcode] = useState(user?.zipcode || "");

  const inputsName = [
    "Recipient",
    "Street",
    "City",
    "State",
    "Country",
    "Recipient PhoneNumber",
    "Recipient Email",
    "Shipping Message",
    "Payment Method",
    "Shipping Type",
  ];

  const options = [
    [{ credit: "Bank Transfer(Credit)" }],
    [{ dhl: "DHL" }, { EMS: "EMS" }, { "UMAC(PH)": "UMAC(PH)" }],
  ];

  // 운임, 총무게
  const totalWeight =
    simpleLists &&
    simpleLists.reduce((i, c) => {
      return i + c.weight * c.quan;
    }, 0) / 1000;

  // 몇번재 구간에 걸리는지 num 에서 1빼야함
  let num = 1;
  for (let i = 1; i < 31; i++) {
    let j = i * 0.5;
    if (j > totalWeight) {
      break;
    }
    num++;
  }

  // 어느나라에 걸리는지
  const zone =
    z &&
    country.length > 0 &&
    country !== "korea" &&
    Object.keys(
      z.find(doc =>
        Object.values(doc).find(asd => asd.country.includes(country))
      )
    );

  // 가격
  const fee =
    z &&
    country.length > 0 &&
    shippingType.length > 0 &&
    totalWeight < 30 &&
    country !== "korea" &&
    shipToKoreaChecked === false
      ? Number(
          Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
            .fee[num - 1].split(",")
            .join("")
        ) / exchangeRate[user.currency]
      : shipToKoreaChecked === true
      ? (totalWeight * 5000) / exchangeRate[user.currency]
      : (totalWeight * user.shippingRate["dhl"]) / exchangeRate[user.currency];

  // total price
  const totalPrice = simpleLists.reduce((i, c) => {
    return i + c.price * c.quan;
  }, 0);
  // amount price
  const amountPrice = totalPrice + fee;

  const included = simpleLists.reduce((i, c) => {
    if (c.moved === false && c.canceled === false && c.shipped === false) {
      return i || c.relDate.toDate() > today;
    }
    return i || false;
  }, false);
  const confirmOrder = async e => {
    e.preventDefault();
    await db
      .collection("orders")
      .doc("b2b")
      .collection("b2borders")
      .add({
        orderState: included ? "Pre-Order" : "Order",
        paymentMethod,
        recipient,
        shippingType,
        street,
        city,
        states,
        country: shipToKoreaChecked ? "korea" : country,
        zipcode,
        recipientPhoneNumber,
        recipientEmail,
        shippingMessage,
        orderNumber: `${user.alias}-${new Date(today)
          .toISOString()
          .substring(2, 10)
          .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)} `,
        createdAt: new Date(),
        customer: orderEmail,
        list: simpleLists,
        dcRates: user.dcRates,
        dcAmount: user.dcAmount,
        shippingRate: user.shippingRate,
        currency: user.currency,
        shippingFee: Number(fee.toFixed(2)),
        amountPrice: Number(amountPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
        memo: "",
        taxId,
        companyName,
        address,
        detailAddress,
        shipToKoreaChecked,
      });
    await db.collection("accounts").doc(user.email).update({
      recipient,
      street,
      city,
      states,
      country,
      zipcode,
      recipientPhoneNumber,
      recipientEmail,
      shippingMessage,
      taxId,
      companyName,
      address,
      detailAddress,
    });

    // totalsold 계산
    for (let i = 0; i < simpleLists.length; i++) {
      db.collection("products")
        .doc(simpleLists[i].productId)
        .update({
          stock:
            products.find(product => product.id === simpleLists[i].productId)
              .data.stock - simpleLists[i].quan,
          totalSold:
            products.find(product => product.id === simpleLists[i].productId)
              .data.totalSold + simpleLists[i].quan,
          totalStock:
            products.find(product => product.id === simpleLists[i].productId)
              .data.totalStock - simpleLists[i].quan,
          stockHistory: firebase.firestore.FieldValue.arrayUnion({
            type: "sell on B2B",
            writer: user.email,
            amount: simpleLists[i].quan,
            date: new Date(),
          }),
        });
    }
    await reset();
    await alert("order completed");
    if (user.type === "admin") {
      history.replace("/orderlist");
    }
    history.replace("/myorderlist");
  };
  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const handlePostCode = data => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    // console.log(data);
    // console.log(fullAddress);
    // console.log(data.zonecode);
    setaddress(fullAddress);
    setZipcode(data.zonecode);
  };

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "20%",
    right: "20%",
    width: "600px",
    height: "600px",
    padding: "7px",
  };

  return (
    // dep-1
    <div className="w-full h-full flex justify-center">
      {/* dep-2 */}
      <form
        className="w-11/12 flex-col mt-20 flex items-center"
        onSubmit={confirmOrder}
      >
        {/* dep-3-1 */}
        <div
          className="text-center text-xl bg-gray-800 py-1 
        rounded-sm font-bold text-gray-100 mb-5 w-full"
        >
          Order Details
        </div>
        {/* dep-3-2 주문자 / 수령인*/}
        <div className="w-full flex flex-col lg:flex-row justify-evenly">
          {/*   dep-3-2-1 주문자 */}
          <div className="flex-col mb-10 flex space-y-2  ">
            <div className="grid grid-cols-2  items-center">
              <div className="text-right pr-3">Order Number</div>
              {user &&
                `${user.alias}-${new Date(today)
                  .toISOString()
                  .substring(2, 10)
                  .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)} `}
            </div>
            {user && (
              <>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Name</div>
                  <div>{user.displayName}</div>
                </div>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Number</div>
                  <div>{user.phoneNumber}</div>
                </div>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Email</div>
                  {user.type === "admin" ? (
                    <input
                      required
                      type="text"
                      name="orderEmail"
                      className="border h-8 pl-2"
                      value={orderEmail}
                      onChange={onChange}
                    />
                  ) : (
                    <div>{user.email}</div>
                  )}
                </div>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Company Name</div>
                  <input
                    type="text"
                    name="companyName"
                    className="border h-8 pl-2"
                    value={companyName}
                    onChange={onChange}
                  />
                </div>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Tax Id</div>
                  <input
                    type="text"
                    name="taxId"
                    className="border h-8 pl-2"
                    placeholder="Optional"
                    value={taxId}
                    onChange={onChange}
                  />
                </div>
                <div className="grid grid-cols-2  items-center">
                  <div className="text-right pr-3">Ship To Korea</div>
                  <input
                    type="checkbox"
                    className="border h-8 pl-2"
                    checked={shipToKoreaChecked ? true : false}
                    onChange={shipToKoreaHandler}
                  />
                </div>
              </>
            )}
          </div>
          {/* 세로선 */}
          <div className="border mb-10"></div>
          {/*   dep-3-2-2 수령인 */}
          {!shipToKoreaChecked ? (
            <div className="flex-col mb-10 flex space-y-2 ">
              {Object.keys(form)
                .slice(0, 10)
                .map((doc, index) => (
                  <>
                    {index === 5 && (
                      <div className="grid grid-cols-2 items-center">
                        <div className="p-1 pr-3 text-right">Zip Code</div>
                        <input
                          required
                          className="border h-8  pl-2"
                          type="text"
                          name="zipcode"
                          value={zipcode}
                          onChange={e => setZipcode(e.target.value)}
                        />
                      </div>
                    )}
                    <div key={index} className="grid grid-cols-2 items-center">
                      <div className="p-1 pr-3 text-right">
                        {inputsName[index]}
                      </div>
                      {doc !== "paymentMethod" &&
                      doc !== "shippingType" &&
                      doc !== "shippingMessage" &&
                      doc !== "country" ? (
                        <input
                          required
                          className="border h-8  pl-2"
                          type="text"
                          name={doc}
                          value={form[doc]}
                          onChange={onChange}
                        />
                      ) : doc === "shippingMessage" ? (
                        <textarea
                          rows="5"
                          cols="19"
                          name="shippingMessage"
                          value={shippingMessage}
                          onChange={onChange}
                          className="border p-1"
                        />
                      ) : (
                        <select
                          required
                          name={doc}
                          value={form[doc]}
                          onChange={onChange}
                          className="border p-1"
                        >
                          {doc === "paymentMethod" ? (
                            <>
                              <option value="">required</option>
                              {options[0].map((option, index) => (
                                <option key={index} value={Object.keys(option)}>
                                  {Object.values(option)}
                                </option>
                              ))}
                            </>
                          ) : doc === "shippingType" ? (
                            <>
                              <option value="">required</option>
                              {options[1].map((option, index) => (
                                <option key={index} value={Object.keys(option)}>
                                  {Object.values(option)}
                                </option>
                              ))}
                            </>
                          ) : doc === "country" ? (
                            <>
                              <option value="">required</option>
                              {countries.sort().map((co, i) => (
                                <option key={i} value={co}>
                                  {co}
                                </option>
                              ))}
                            </>
                          ) : (
                            ""
                          )}
                        </select>
                      )}
                    </div>
                  </>
                ))}
            </div>
          ) : (
            <div className="flex-col mb-10 flex space-y-2 ">
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Recipient</div>
                <input
                  required
                  className="border h-8  pl-2"
                  type="text"
                  name="recipient"
                  value={recipient}
                  onChange={onChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Address</div>
                <input
                  required
                  disabled
                  className="border h-8  pl-2"
                  type="text"
                  name="address"
                  value={address}
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Detail Address</div>
                <div className="grid grid-cols-2 items-center">
                  <input
                    required
                    className="border h-8 pl-2"
                    type="text"
                    name="detailAddress"
                    value={detailAddress}
                    onChange={e => setdetailAddress(e.target.value)}
                  />
                  <div className="">
                    {/* // 버튼 클릭 시 팝업 생성 */}
                    {!isPopupOpen ? (
                      <button
                        type="button"
                        onClick={openPostCode}
                        className=" bg-gray-400 rounded-md p-1 px-2 ml-3 text-gray-100"
                      >
                        Search{" "}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={closePostCode}
                        className=" bg-gray-400 rounded-md p-1 px-2 ml-3 text-gray-100"
                      >
                        Close
                      </button>
                    )}
                    {/* // 팝업 생성 기준 div */}
                    <div id="popupDom">
                      {isPopupOpen && (
                        <DaumPostcode
                          style={postCodeStyle}
                          onComplete={handlePostCode}
                          autoClose
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Zip Code</div>
                <input
                  required
                  disabled
                  className="border h-8  pl-2"
                  type="text"
                  name="zipcode"
                  value={zipcode}
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Recipient PhoneNumber</div>
                <input
                  required
                  className="border h-8  pl-2"
                  type="text"
                  name="recipientPhoneNumber"
                  value={recipientPhoneNumber}
                  onChange={onChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Recipient Email</div>
                <input
                  required
                  className="border h-8  pl-2"
                  type="text"
                  name="recipientEmail"
                  value={recipientEmail}
                  onChange={onChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Shipping Message</div>
                <textarea
                  rows="5"
                  cols="19"
                  name="shippingMessage"
                  value={shippingMessage}
                  onChange={onChange}
                  className="border p-1"
                />
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Payment Method</div>
                <select
                  required
                  name="paymentMethod"
                  value={paymentMethod}
                  className="border p-1"
                  onChange={onChange}
                >
                  <option>required</option>
                  <option value="credit">Bank Transfer(Credit)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="p-1 pr-3 text-right">Shipping Type</div>
                <select
                  required
                  name="shippingType"
                  value={shippingType}
                  className="border p-1 outline-none"
                  onChange={onChange}
                >
                  {" "}
                  <option>required</option>
                  <option value="dhl">DHL</option>
                  <option value="EMS">EMS</option>
                  <option value="UMAC(PH)">UMAC(PH)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* dep-3-3 */}
        <div className="flex-col mb-10 w-full">
          {/* 번호/앨범명/판매가/할인가/금액 */}
          <div
            className="grid grid-cols-6 lg:grid-cols-12 text-center bg-gray-800 rounded-sm 
         text-sm font-semibold text-gray-100"
          >
            <div className="hidden lg:grid col-span-2">No.</div>
            <div className="hidden lg:grid col-span-2">SKU</div>
            <div className="col-span-4">TITLE</div>
            <div className="hidden lg:grid col-span-1">RELEASE</div>
            <div>PRICE</div>
            <div>EA</div>
            <div className="hidden lg:grid col-span-1">AMOUNT</div>
          </div>
          {simpleLists && (
            <>
              {simpleLists.map((doc, index) => (
                <div
                  className="grid grid-cols-6 lg:grid-cols-12 text-center 
                  text-xs lg:text-sm bg-white border-b border-r border-l py-1"
                  key={index}
                >
                  <div className="hidden lg:grid lg:col-span-2">
                    {doc.childOrderNumber}
                  </div>
                  <div className="hidden lg:grid lg:col-span-2">
                    {
                      products?.find(product => product.id === doc.productId)
                        .data.sku
                    }
                  </div>
                  <div className="col-span-4 text-left pl-2">{doc.title}</div>
                  <div className="hidden lg:grid lg:col-span-1">
                    {new Date(doc.relDate.toDate()).toLocaleDateString()}
                  </div>

                  <div>
                    {doc.price?.toLocaleString("ko-KR")} {user?.currency}
                  </div>

                  <div>{doc.quan} EA</div>

                  <div className="hidden lg:grid lg:col-span-1">
                    {(doc.price * doc.quan)?.toLocaleString("ko-KR")}{" "}
                    {user?.currency}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* dep-3-4 */}
        <div className="flex-col mb-10 w-full flex items-end">
          <div className="grid grid-cols-2 w-2/3 text-right ">
            <div>TOTAL PRICE</div>
            <div>
              {simpleLists && simpleLists[0]?.currency === "KRW"
                ? totalPrice.toLocaleString("ko-KR")
                : totalPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
              {user?.currency}
            </div>
          </div>

          <div className="grid grid-cols-2  text-right  w-2/3">
            <div>SHIPPING FEE</div>
            <div className="w-full">
              {fee && user?.currency === "KRW"
                ? `${fee.toLocaleString("ko-KR")} ${user?.currency}`
                : fee && user?.currency !== "KRW"
                ? `${fee.toFixed(2).toLocaleString("ko-KR")} ${user?.currency}`
                : "Please select country and shipping type"}
            </div>
          </div>
          <div className="grid grid-cols-2  text-right  w-2/3">
            <div>AMOUNT</div>
            <div className="w-full">
              {amountPrice && user?.currency === "KRW"
                ? `${amountPrice.toLocaleString("ko-KR")} ${user?.currency}`
                : amountPrice && user?.currency !== "KRW"
                ? `${amountPrice.toFixed(2).toLocaleString("ko-KR")} ${
                    user?.currency
                  }`
                : "Please select country and shipping type"}
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-6 items-center mb-96 
        w-full place-items-center"
        >
          <div className="col-span-3">
            <div className="text-sm">
              1. Actual shipping cost may be adjusted.
            </div>
            <div className="text-sm">
              2. The exchange rate at time of order rates will apply.
            </div>
            <div className="text-sm">
              3. Delivery time may be adjusted depending on pre-ordered
              products.
            </div>
            <div className="text-sm">
              4. Quantity regulation by the buyer is only possible prior to
              shipment processing.
            </div>
            <div className="text-md font-semibold text-center mt-3">
              If you agree with all the details, please check the right.
              <input
                required
                className="ml-3"
                type="checkbox"
                checked={confirmChecked ? true : false}
                onChange={checkHandler}
              />
            </div>
          </div>

          <button
            className={`${
              confirmChecked
                ? "mt-5 lg:mt-1 col-span-2 bg-gray-800 py-2 px-8 rounded-sm text-gray-100"
                : "mt-5 lg:mt-1 col-span-2 bg-gray-100 py-2 px-8 rounded-sm text-gray-100"
            }`}
            type="submit"
          >
            ORDER
          </button>
        </div>
      </form>
    </div>
  );
};

export default B2bOrder;
