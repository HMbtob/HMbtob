import React, { useState } from "react";
import { useEffect } from "react";
import { db } from "../../../firebase";
import { onSubmitToShip } from "../../../utils/shippingUtils";
// import { Caled } from "./Caled";
import { Inputed } from "./Inputed";
// import { ShipToKorea } from "./ShipToKorea";

export function OrderListDetailPrice({
  handleSubmit,
  orders,
  account,
  checkedInputs,
  exR,
}) {
  // for 계산 or 입력 라디오
  const [checkedRadio, setCheckedRadio] = useState("caled");

  // tracking number
  const [trackingNumber, setTrackingNum] = useState("");

  // for 배송비 입력
  const [inputedShippingFee, setInputedShippingFee] = useState(0);

  // for 가격 계산
  const [caledPrice, setCaledPrice] = useState(0);
  const [caledshippingFee, setCaledshippingFee] = useState(0);

  // for 총 갯수
  const [totalSorts, setTotalSorts] = useState(0);
  const [totalEa, setTotalEa] = useState(0);

  // 무게/배송지에 따른 배송비 계산하기. 배송지, 배송요율 설정해야함
  const onCal = async () => {
    const fee = await db.collection("shippingFee").doc("dhl").get();
    console.log("fee", fee.data());
    const checkedItems = orders.filter((order) =>
      checkedInputs.includes(order.id)
    );

    if (checkedItems.length < 1) {
      return alert("계산할 상품을 선택해 주세요.");
    }
    setTotalSorts(checkedItems.length);
    setTotalEa(
      checkedItems.reduce((a, c) => {
        return a + Number(c.data.quan);
      }, 0)
    );
    // 체크된 아이템 총가격

    const totalPrice =
      exR[account.data.currency] === 1
        ? Number(
            checkedItems
              .reduce((a, c) => {
                return a + Number(c.data.totalPrice);
              }, 0)
              .toFixed(0)
          )
        : Number(
            checkedItems
              .reduce((a, c) => {
                return a + Number(c.data.totalPrice);
              }, 0)
              .toFixed(2)
          );

    // 체크된 아이템 총무게
    const totalWeight =
      checkedItems.reduce((a, c) => {
        return a + Number(c.data.totalWeight);
      }, 0) / 1000;

    // 몇번째 구간에 걸리는지
    // let num = 1;
    // for (let i = 1; i < 31; i++) {
    //   let j = i * 0.5;
    //   if (j > totalWeight) {
    //     break;
    //   }
    //   num++;
    // }
    // // 몇번째 존인지
    // const zone = Object.keys(
    //   fee
    //     .data()
    //     .z.find((doc) =>
    //       Object.values(doc).find((asd) =>
    //         asd.country.includes(checkedItems[0]?.data.country)
    //       )
    //     )
    // );
    // 30키로 이하 배송비(외국)
    console.log("totalWeight", totalWeight);
    const shippingFee =
      // totalWeight < 30
      //   ? Number(
      //       Object.values(
      //         fee.data().z.find((doc) => Object.keys(doc)[0] === zone[0])
      //       )[0]
      //         .fee[num - 1].split(",")
      //         .join("")
      //     )
      //   : account.data.shippingRate.dhl * totalWeight;
      // to korea
      // const shippingFeeToKorea = (parseInt(totalWeight / 15) + 1) * 4500;
      setCaledPrice(totalPrice);
    setCaledshippingFee(
      exR
        ? exR[account.data.currency] === 1
          ? checkedRadio === "caled"
            ? shippingFee / exR[account.data.currency]
            : shippingFee / exR[account.data.currency]
          : checkedRadio === "caled"
          ? Number((shippingFee / exR[account.data.currency]).toFixed(2))
          : Number((shippingFee / exR[account.data.currency]).toFixed(2))
        : checkedRadio === "caled"
        ? shippingFee
        : shippingFee
    );
  };

  // button disabled
  const [disButton, setDisButton] = useState(true);
  useEffect(() => {
    caledPrice > 0 || trackingNumber.length > 0
      ? setDisButton(false)
      : setDisButton(true);
  }, [caledPrice, trackingNumber]);

  return (
    <div className="mb-32">
      <div
        className="grid grid-flow-col text-center bg-gray-800 mt-12
           text-gray-100 py-1 rounded-sm text-md items-center "
      >
        발송처리
      </div>
      <div className="flex flex-row justify-evenly">
        {/* <Caled
          checkedRadio={checkedRadio}
          setCheckedRadio={setCheckedRadio}
          onCal={onCal}
          caledPrice={caledPrice}
          caledshippingFee={caledshippingFee}
        />
        <ShipToKorea
          checkedRadio={checkedRadio}
          setCheckedRadio={setCheckedRadio}
          onCal={onCal}
          caledPrice={caledPrice}
          caledshippingFee={caledshippingFee}
        /> */}
        <Inputed
          checkedRadio={checkedRadio}
          setCheckedRadio={setCheckedRadio}
          setInputedShippingFee={setInputedShippingFee}
          inputedShippingFee={inputedShippingFee}
          //
          onCal={onCal}
          caledPrice={caledPrice}
        />
      </div>
      <div className="flex flex-row w-full justify-center mt-12">
        <textarea
          required
          cols="40"
          rows="5"
          value={trackingNumber}
          onChange={(e) => setTrackingNum(e.target.value)}
          className="col-span-3 ml-20 outline-none border pl-2 text-sm"
          placeholder="tracking number.  2개 이상은 ' , '(콤마) 로 구분 "
        ></textarea>
        <button
          disabled={disButton}
          type="button"
          className={`${
            disButton ? "bg-gray-400" : "bg-blue-900"
          } text-white px-5 rounded-sm ml-5`}
          onClick={() =>
            handleSubmit(
              onSubmitToShip(
                orders,
                checkedRadio,
                inputedShippingFee,
                caledPrice,
                caledshippingFee,
                trackingNumber,
                checkedInputs
              )
            )
          }
        >
          총 {totalSorts} 종,{totalEa} EA 발송처리
        </button>
      </div>
    </div>
  );
}
