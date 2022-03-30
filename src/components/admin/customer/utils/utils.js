import firebase from "firebase";
import { db } from "../../../../firebase";

// 유저삭제
export function handleDelete(account) {
  let con = window.confirm("정말로 삭제하시겠습니까?");
  if (con === true) {
    db.collection("accounts").doc(account.id).delete();
  } else if (con === false) {
    return;
  }
}

// 크레딧 수정
export function saveCredit(user, data) {
  const { handleCredit, creditType } = data;
  db.collection("accounts")
    .doc(user.id)
    .update({
      credit: Number(user.data.credit) + Number(handleCredit),
      creditDetails: firebase.firestore.FieldValue.arrayUnion({
        type: creditType,
        amount: Number(handleCredit),
        currency: user.data.currency,
        date: new Date(),
        totalAmount: Number(user.data.credit) + Number(handleCredit),
      }),
    });
  alert("크레딧 수정 완료");
}

// 배송요율 저장
export function saveShippingRate(user, data) {
  const { dhl } = data;

  db.collection("accounts")
    .doc(user.id)
    .update({
      shippingRate: { dhl: Number(dhl) },
    });
  alert("배송요율 수정 완료");
}
// 할인액 저장
export function saveDcAmount(user, data) {
  db.collection("accounts").doc(user.id).update({
    dcAmount: data,
  });
  alert("할인액 수정 완료");
}

// 할인율 저장
export function saveDcRates(user, data) {
  db.collection("accounts").doc(user.id).update({
    dcRates: data,
  });
  alert("할인율 수정 완료");
}
