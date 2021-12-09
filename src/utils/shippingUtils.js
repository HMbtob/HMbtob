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
  getValues,
  checkedRadio,
  inputedPrice,
  inputedShippingFee,
  caledPrice,
  caledshippingFee,
  trackingNumber
) => {
  if (trackingNumber.length < 1) {
    return alert("운송장 번호를 작성해 주세요.");
  }
  const today = new Date();
  const saveId = uuid();
  const values = getValues();
  // 계산된가격

  const checkedItems = orders.filter(order =>
    Object.keys(values)
      .reduce((a, c) => {
        if (values[c] === true) {
          a.push(c);
        }
        return a;
      }, [])
      .includes(order.id)
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
  await db
    .collection("accounts")
    .doc(orders[0]?.data.userId)
    .collection("shippingsInAccount")
    .doc(saveId)
    .set({
      shippingNumber: `${today
        .toISOString()
        .substring(0, 10)}-${orders[0]?.data.userUid.substring(0, 4)}`,
      shippedDate: today,
      ...addressInfo.docs.map(doc => doc.data())[0],
      itemsPrice:
        checkedRadio === "caled"
          ? caledPrice
          : checkedRadio === "inputed"
          ? inputedPrice
          : caledPrice,
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
          ? inputedPrice + inputedShippingFee
          : caledPrice + caledshippingFee,

      currency: orders[0]?.data.currency,
      exchangeRate: orders[0]?.data.exchangeRate,
      trackingNumber,
      nickName: orders[0]?.data.nickName,
      userId: orders[0]?.data.userId,
    });
  // 생성한 발송에 선택한 상품 콜렉션에 추가
  checkedItems.map(
    async order =>
      await db
        .collection("accounts")
        .doc(orders[0]?.data.userId)
        .collection("shippingsInAccount")
        .doc(saveId)
        .collection("orderListInShippings")
        .doc()
        .set({ ...order.data })
  );
  // 추가후 선택한 상품 주문에서 삭제
  checkedItems.map(
    async order =>
      await db
        .collection("accounts")
        .doc(orders[0]?.data.userId)
        .collection("order")
        .doc(order.id)
        .delete()
  );
  alert("상품발송이 완료 되었습니다.");
};

// ToLocalString date
export function toDate(timeSec) {
  return new Date(timeSec * 1000).toISOString().substring(0, 10);
}
