import React, { useContext, useState } from "react";
import firebase from "firebase";
import { useHistory } from "react-router";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ImageIcon from "@material-ui/icons/Image";
import LinkIcon from "@material-ui/icons/Link";

const B2bSpecialOrder = () => {
  const state = useContext(InitDataContext);
  const history = useHistory();
  const today = new Date();
  const { user, simpleLists, products, dhlShippingFee, exchangeRate, orders } =
    state;
  const { z } = dhlShippingFee;

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
    .filter(order => order?.data?.customer === user?.email)
    .filter(
      order =>
        new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10) === new Date(today).toISOString().substring(0, 10)
    )
    ? orders
        .filter(order => order?.data?.customer === user?.email)
        .filter(
          order =>
            new Date(order.data.createdAt.seconds * 1000)
              .toISOString()
              .substring(0, 10) ===
            new Date(today).toISOString().substring(0, 10)
        ).length
    : 0;

  // specialorderlist 만들기
  const [specialList, setSpecialList] = useState([]);

  const [inputs, setInputs] = useState({
    shopName: "",
    title: "",
    titleUrl: "",
    thumbNailUrl: "",
    price: "",
    qty: "",
  });

  const { shopName, title, titleUrl, thumbNailUrl, price, qty } = inputs; // 비구조화 할당을 통해 값 추출

  const onChange2 = e => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  const onReset = () => {
    setInputs({
      shopName: "",
      title: "",
      titleUrl: "",
      thumbNailUrl: "",
      price: "",
      qty: "",
    });
  };

  const addSpecialList = e => {
    e.preventDefault();
    if (
      shopName.length > 0 &&
      title.length > 0 &&
      titleUrl.length > 0 &&
      price.length > 0 &&
      qty.length > 0
    ) {
      setSpecialList([
        ...specialList,
        {
          childOrderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}-${
            specialList.length + 1
          }`,
          shopName,
          title,
          titleUrl,
          thumbNailUrl,
          qty: Number(Number(qty).toFixed(0)),
          amount: Number(
            (
              Number(
                price * (1 - user.dcRates["specialOrder"]) +
                  Number(user.dcAmount["specialOrderA"].toFixed(0))
              ) * qty
            ).toFixed(2)
          ),
          //
          exchangeRate,
          orderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}`,
          currency: user.currency,
          nickName: user.nickName,
          productId: 0,
          quan: Number(Number(qty).toFixed(0)),
          price:
            Number(
              price * (1 - user.dcRates["specialOrder"]) +
                Number(user.dcAmount["specialOrderA"].toFixed(0))
            ) || 0,
          totalPrice: Number(
            (
              Number(
                price * (1 - user.dcRates["specialOrder"]) +
                  user.dcAmount["specialOrderA"].toFixed(0)
              ) * qty
            ).toFixed(2)
          ),
          weight: 0,
          totalWeight: 0,
          dcRate: Number(state.user.dcRates["specialOrder"]) || 0,
          dcAmount: Number(state.user.dcAmount["specialOrderA"]) || 0,
          relDate: today,
          preOrderDeadline: today,
          moved: false,
          moveTo: "",
          canceled: false,
          shipped: false,
          createdAt: today,
          barcode: 0,
          sku: 0,
        },
      ]);

      onReset();
    } else {
      alert("Type");
    }
  };

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
  //  인풋
  const [form, onChange, reset] = useInputs({
    recipient: user?.recipient,
    street: user?.street,
    city: user?.city,
    states: user?.states,
    country: user?.country,
    zipcode: user?.zipcode,
    recipientPhoneNumber: user?.recipientPhoneNumber,
    recipientEmail: user?.recipientEmail,
    shippingMessage: user?.shippingMessage,
    paymentMethod: "",
    shippingType: "",
    orderEmail: user?.email,
  });

  const {
    recipient,
    street,
    city,
    states,
    country,
    zipcode,
    recipientPhoneNumber,
    recipientEmail,
    shippingMessage,
    paymentMethod,
    shippingType,
  } = form;
  const { orderEmail } = form;
  const inputsName = [
    "recipient",
    "street",
    "city",
    "state",
    "country",
    "zipcode",
    "PhoneNumber",
    "Email",
    "Memo",
    "Payment Method",
    "Shipping Type",
  ];

  const options = [
    [{ credit: "Bank Transfer(Credit)" }],
    [{ dhl: "DHL" }, { EMS: "EMS" }],
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
    Object.keys(
      z.find(doc =>
        Object.values(doc).find(asd => asd.country.includes(country))
      )
    );

  // 가격
  const fee =
    z && country.length > 0 && shippingType.length > 0 && totalWeight < 30
      ? Number(
          Object.values(z.find(doc => Object.keys(doc)[0] === zone[0]))[0]
            .fee[num - 1].split(",")
            .join("")
        ) / exchangeRate[user.currency]
      : (totalWeight * user.shippingRate["dhl"]) / exchangeRate[user.currency];

  // total price
  const totalPrice = specialList.reduce((i, c) => {
    return i + c.amount;
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
        orderState: "Special-Order",
        paymentMethod,
        recipient,
        shippingType,
        street,
        city,
        states,
        country,
        zipcode,
        recipientPhoneNumber,
        recipientEmail,
        shippingMessage,
        orderNumber: `${user.alias}-${new Date(today)
          .toISOString()
          .substring(2, 10)
          .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}`,
        createdAt: new Date(),
        customer: orderEmail,
        list: specialList,
        dcRates: user.dcRates,
        dcAmount: user.dcAmount,
        shippingRate: user.shippingRate,
        currency: user.currency,
        shippingFee: 0,
        amountPrice: Number(totalPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
        memo: "",
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
    });

    // totalsold 계산

    await reset();
    await alert("주문 완료");
    if (user.type === "admin") {
      history.replace("/orderlist");
    }
    history.replace("/myorderlist");
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
          Special Order Details
        </div>
        {/* dep-3-2 주문자 / 수령인*/}
        <div className="w-full flex flex-row justify-evenly">
          {/*   dep-3-2-1 주문자 */}
          <div className="flex-col mb-10 flex space-y-2  w-2/5">
            <div className="grid grid-cols-2">
              <div>Order Number</div>
              {user &&
                `${user.alias}-${new Date(today)
                  .toISOString()
                  .substring(2, 10)
                  .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}`}
            </div>
            {user && (
              <>
                <div className="grid grid-cols-2">
                  <div>Name</div>
                  <div>{user.displayName}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>Number</div>
                  <div>{user.phoneNumber}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div>Email</div>
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
              </>
            )}
          </div>
          {/* 세로선 */}
          <div className="border mb-10"></div>
          {/*   dep-3-2-2 수령인 */}
          <div className="flex-col mb-10 flex space-y-2 w-2/5">
            {Object.keys(form)
              .slice(0, -1)
              .map((doc, index) => (
                <div key={index} className="grid grid-cols-2">
                  <div className="p-1">{inputsName[index]}</div>
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
                      className="border"
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
              ))}
          </div>
        </div>

        {/* dep-3-3 */}
        <div className="flex-col mb-10 w-full">
          {/* 번호/앨범명/판매가/할인가/금액 */}

          <div
            className="grid grid-cols-28 text-center bg-gray-800 rounded-sm 
         text-sm font-semibold text-gray-100"
          >
            <div className="col-span-4">No.</div>
            <div className="col-span-3">Shop Name</div>
            <div className="col-span-7">Title</div>
            <div className="col-span-2">Url</div>
            <div className="col-span-2">Thumb Nail</div>
            <div className="col-span-3">Price</div>
            <div className="col-span-3">Fee</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Amount</div>
          </div>
          {specialList &&
            specialList.map((li, i) => (
              <div key={i} className="grid grid-cols-28 text-xs">
                <div className="col-span-4 text-center p-1">
                  {li.childOrderNumber}
                </div>
                <div className="col-span-3 text-center p-1">{li.shopName}</div>
                <div className="col-span-7 p-1">{li.title}</div>
                <div className="col-span-2 p-1 text-center">
                  {li.titleUrl && (
                    <button
                      onClick={() => window.open(`${li.titleUrl}`, "_blank")}
                    >
                      <LinkIcon style={{ color: "gray" }} />
                    </button>
                  )}
                </div>
                <div className="col-span-2 p-1 text-center">
                  {li.thumbNailUrl && (
                    <button
                      onClick={() =>
                        window.open(`${li.thumbNailUrl}`, "_blank")
                      }
                    >
                      <ImageIcon style={{ color: "gray" }} />
                    </button>
                  )}
                </div>
                <div className="col-span-3 text-center p-1">
                  {li.price - li.dcAmount} krw
                </div>
                <div className="col-span-3 text-center p-1">
                  {li.dcAmount} krw
                </div>
                <div className="col-span-2 text-center p-1">{li.qty} ea</div>
                <div className="col-span-2 text-center p-1">
                  {li.amount} krw
                </div>
              </div>
            ))}
          <div
            className="grid grid-cols-28 rounded-sm 
         text-sm  text-gray-800 items-center"
          >
            <div className="col-span-4 flex justify-center items-center">
              <button onClick={addSpecialList}>
                <AddCircleIcon style={{ color: "grey" }} />
              </button>
            </div>
            <div className="col-span-3">
              <select
                name=""
                id=""
                className="border h-8 w-full pl-2 outline-none"
                name="shopName"
                onChange={onChange2}
                value={shopName}
              >
                <option>select</option>
                <option value="OTHER">OTHER</option>
                <option value="SM">SM</option>
                <option value="YG">YG</option>
              </select>
            </div>
            <div className="col-span-7 flex ">
              <input
                type="text"
                placeholder="Copy and paste item title"
                className="border h-8 w-full pl-2 outline-none"
                name="title"
                onChange={onChange2}
                value={title}
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Copy and paste item url"
                className="border h-8 w-full pl-2 outline-none"
                name="titleUrl"
                onChange={onChange2}
                value={titleUrl}
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Copy and paste the thumbnail URL."
                className="border h-8 w-full pl-2 outline-none"
                name="thumbNailUrl"
                onChange={onChange2}
                value={thumbNailUrl}
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                placeholder="Price(KRW)"
                className="border h-8 w-full  text-left pl-2 outline-none"
                name="price"
                onChange={onChange2}
                value={price}
              />
            </div>
            <div className="col-span-3"></div>
            <div className="col-span-2">
              <input
                type="number"
                placeholder="Qty"
                className="border h-8 w-full text-left pl-2 outline-none"
                name="qty"
                onChange={onChange2}
                value={qty}
              />
            </div>
            <div className="col-span-2 text-center font-semibold">
              {price && qty && price * qty}
            </div>
          </div>
          {/* <div className="w-full text-right text-sm text-gray-600 p-2">
            Copy and paste the
            <span className="text-base font-semibold text-gray-800">
              {" "}
              Thumb Nail
            </span>{" "}
            url address and press Enter. Please wait until the address changes.
          </div> */}
          {/* <div
            className="flex flex-col rounded-sm 
         text-base  text-gray-800 items-center bg-gray-400"
          > */}

          {/* </div> */}
          {/* {simpleLists && (
            <>
              {simpleLists.map((doc, index) => (
                <div
                  className="grid grid-cols-12 text-center text-sm bg-white
                  border-b border-r border-l py-1"
                  key={index}
                >
                  <div className="col-span-2">{doc.childOrderNumber}</div>
                  <div className="col-span-2">
                    {
                      products?.find(product => product.id === doc.productId)
                        .data.sku
                    }
                  </div>
                  <div className="col-span-4 text-left">{doc.title}</div>
                  <div className="col-span-1">
                    {new Date(doc.relDate.toDate()).toLocaleDateString()}
                  </div>

                  <div>
                    {doc.price?.toLocaleString("ko-KR")} {user?.currency}
                  </div>

                  <div>{doc.quan} EA</div>

                  <div>
                    {(doc.price * doc.quan)?.toLocaleString("ko-KR")}{" "}
                    {user?.currency}
                  </div>
                </div>
              ))}
            </>
          )} */}
        </div>

        {/* dep-3-4 */}
        <div className="flex-col mb-10 w-full flex items-end">
          <div className="grid grid-cols-2 w-2/3 text-right ">
            <div>TOTAL PRICE</div>
            <div>
              {totalPrice && totalPrice.toLocaleString("ko-KR")} KRW
              {/* {simpleLists && simpleLists[0]?.currency === "KRW"
                ? totalPrice.toLocaleString("ko-KR")
                : totalPrice.toFixed(2).toLocaleString("ko-KR")}{" "}
              {user?.currency} */}
            </div>
          </div>

          {/* <div className="grid grid-cols-2  text-right  w-2/3">
            <div>SHIPPING FEE</div>
            <div className="w-full">
              {fee && user?.currency === "KRW"
                ? `${fee.toLocaleString("ko-KR")} ${user?.currency}`
                : fee && user?.currency !== "KRW"
                ? `${fee.toFixed(2).toLocaleString("ko-KR")} ${user?.currency}`
                : "Please select country and shipping type"}
            </div>
          </div> */}
          {/* <div className="grid grid-cols-2  text-right  w-2/3">
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
          </div> */}
        </div>

        <div className="grid grid-cols-6 items-center mb-96 w-full place-items-center">
          <div className="col-span-3">기본 약관/안내 체크하면 버튼 활성화</div>
          <input
            required
            className="col-span-1"
            type="checkbox"
            checked={confirmChecked ? true : false}
            onChange={checkHandler}
          />
          <button
            className={`${
              confirmChecked
                ? "col-span-2 bg-gray-800 py-2 px-8 rounded-sm text-gray-100"
                : "col-span-2 bg-gray-100 py-2 px-8 rounded-sm text-gray-100"
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

export default B2bSpecialOrder;
