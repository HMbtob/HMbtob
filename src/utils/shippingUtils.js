import uuid from "react-uuid";
import { db } from "../firebase";

// 원단위 콤마
export const krwComma = (num, cur) => {
  let calNum;
  cur === "KRW"
    ? (calNum = Number(num.toString().replaceAll(",", ""))
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    : (calNum = Number(num.toString().replaceAll(",", ""))
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

  return calNum;
};

// 발송처리
export const onSubmitToShip = async (
  orders,
  checkedRadio,
  inputedShippingFee,
  caledPrice,
  caledshippingFee,
  trackingNumber,
  checkedInputs
) => {
  if (trackingNumber.length < 1) {
    return alert("운송장 번호를 작성해 주세요.");
  }
  const today = new Date();
  const saveId = uuid();
  // 계산된가격
  const checkedItems = orders.filter((order) =>
    checkedInputs.includes(order.id)
  );

  if (checkedItems?.length < 1) {
    return alert("발송할 상품을 선택해 주세요.");
  }
  // 발송할 배송지
  const addressInfo = await db
    .collection("accounts")
    .doc(checkedItems[0]?.data.userId)
    .collection("addresses")
    .where("name", "==", `${checkedItems[0]?.data.addName}`)
    .get();

  // 체크된 아이템 리스트
  // 발송생성
  try {
    await db
      .collection("accounts")
      .doc(orders[0]?.data.userId)
      .collection("shippingsInAccount")
      .doc(saveId)
      .set({
        shippingNumber: `${today
          .toISOString()
          .substring(2, 10)}-${orders[0]?.data.userUid.substring(
          0,
          3
        )}${saveId.substring(0, 3)}`,
        shippedDate: today,
        ...addressInfo.docs.map((doc) => doc.data())[0],
        itemsPrice: caledPrice,
        shippingFee:
          checkedRadio === "caled"
            ? caledshippingFee
            : checkedRadio === "inputed"
            ? inputedShippingFee
            : caledshippingFee,
        totalAmount:
          checkedRadio === "caled"
            ? caledPrice + caledshippingFee
            : checkedRadio === "inputed"
            ? caledPrice + inputedShippingFee
            : caledPrice + caledshippingFee,

        currency: orders[0]?.data.currency,
        exchangeRate: orders[0]?.data.exchangeRate,
        trackingNumber,
        nickName: orders[0]?.data.nickName,
        userId: orders[0]?.data.userId,
      });
  } catch (e) {
    await db
      .collection("error")
      .doc()
      .set({ name: "발송 생성 오류", createdAt: today });
    console.log("발송 생성 오류", e);
  }

  await Promise.all(
    checkedItems.map(async (order, i) => {
      try {
        // console.log(i + 1, "번째 뱃치시작", order);
        let batch = db.batch();

        let orderListInShippingsRef = db
          .collection("accounts")
          .doc(orders[0]?.data.userId)
          .collection("shippingsInAccount")
          .doc(saveId)
          .collection("orderListInShippings")
          .doc(order.id);
        if (
          order.data.sku !== "AddOrder" &&
          order.data.sku !== "specialOrder"
        ) {
          let newStockHistoryRef = db
            .collection("products")
            .doc(order.data.productId)
            .collection("newStockHistory")
            .doc(order.id);
          batch.update(newStockHistoryRef, {
            shipped: true,
            shippedQty: order.data.quan,
            shippedDate: today,
          });
        }
        let deleteRef = db
          .collection("accounts")
          .doc(orders[0]?.data.userId)
          .collection("order")
          .doc(order.id);

        batch.set(orderListInShippingsRef, { ...order.data });
        batch.delete(deleteRef);

        batch.commit();
      } catch (e) {
        await db
          .collection("error")
          .doc()
          .set({ name: "뱃치오류 오류", createdAt: today, e, order, i });
        console.log(e);
      }
    })
  );

  // await Promise.all(
  //   checkedItems.map(async (order) => {
  //     try {
  //       // 생성한 발송에 선택한 상품 콜렉션에 추가
  //       await db
  //         .collection("accounts")
  //         .doc(orders[0]?.data.userId)
  //         .collection("shippingsInAccount")
  //         .doc(saveId)
  //         .collection("orderListInShippings")
  //         .doc(order.id)
  //         .set({ ...order.data });
  //       // // 재고수불부 업데이트
  //       // await db
  //       //   .collection("products")
  //       //   .doc(order.data.productId)
  //       //   .collection("newStockHistory")
  //       //   .doc(order.id)
  //       //   .update({
  //       //     shipped: true,
  //       //     shippedQty: order.data.quan,
  //       //     shippedDate: today,
  //       //   });
  //       // // 추가후 선택한 상품 주문에서 삭제
  //       // await db
  //       //   .collection("accounts")
  //       //   .doc(orders[0]?.data.userId)
  //       //   .collection("order")
  //       //   .doc(order.id)
  //       //   .delete();
  //     } catch (e) {
  //       await db.collection("error").doc().set({
  //         name: "orderListInShippings or newStockHistory or 주문삭제 오류",
  //         createdAt: today,
  //         order,
  //       });
  //       console.log(e);
  //     }
  //   })
  // );

  // await Promise.all(
  //   checkedItems.map(async (order) => {
  //     try {
  //       // 재고수불부 업데이트
  //       await db
  //         .collection("products")
  //         .doc(order.data.productId)
  //         .collection("newStockHistory")
  //         .doc(order.id)
  //         .update({
  //           shipped: true,
  //           shippedQty: order.data.quan,
  //           shippedDate: today,
  //         });
  //     } catch (e) {
  //       await db.collection("error").doc().set({
  //         name: "newStockHistory",
  //         createdAt: today,
  //         order,
  //       });
  //       console.log("newStockHistory", order);
  //       console.log(e);
  //     }
  //   })
  // );
  // await Promise.all(
  //   checkedItems.map(async (order) => {
  //     try {
  //       await db
  //         .collection("accounts")
  //         .doc(orders[0]?.data.userId)
  //         .collection("order")
  //         .doc(order.id)
  //         .delete();
  //     } catch (e) {
  //       await db
  //         .collection("error")
  //         .doc()
  //         .set({ name: "주문삭제 오류", createdAt: today, order });

  //       console.log("주문삭제 오류", order);
  //       console.log(e);
  //     }
  //   })
  // );

  // 크레딧 마지막 밸런스 가져오기
  try {
    const lastBalance = await db
      .collection("accounts")
      .doc(orders[0]?.data.userId)
      .collection("credit")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then((doc) => doc.docs.map((doc) => ({ id: doc.id, data: doc.data() })));

    const balance = lastBalance[0]?.data?.balance || 0;
    const total =
      balance -
      (checkedRadio === "caled"
        ? caledPrice + caledshippingFee
        : checkedRadio === "inputed"
        ? caledPrice + inputedShippingFee
        : caledPrice + caledshippingFee);
    // 크레딧 차감
    await db
      .collection("accounts")
      .doc(orders[0]?.data.userId)
      .collection("credit")
      .doc()
      .set({
        createdAt: today,
        content: "Shipped Order",
        currency: orders[0]?.data.currency,
        memo: `${today
          .toISOString()
          .substring(2, 10)}-${orders[0]?.data.userUid.substring(
          0,
          3
        )}${saveId.substring(0, 3)}`,
        plus: 0,
        minus:
          checkedRadio === "caled"
            ? caledPrice + caledshippingFee
            : checkedRadio === "inputed"
            ? caledPrice + inputedShippingFee
            : caledPrice + caledshippingFee,
        balance: total,
      });
  } catch (e) {
    await db
      .collection("error")
      .doc()
      .set({ name: "크레딧 차감 오류", createdAt: today });

    console.log("크레딧 차감 오류", e);
  }

  alert("상품발송이 완료 되었습니다.");
};

// ToLocalString date
export function toDate(timeSec) {
  if (timeSec) {
    return new Date(timeSec * 1000).toISOString().substring(0, 10);
  }
}
