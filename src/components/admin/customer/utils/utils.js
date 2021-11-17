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

  db.collection("accounts").doc(user.id).update({
    shippingRate: { dhl },
  });
  alert("배송요율 수정 완료");
}
// 할인액 저장
export function saveDcAmount(user, data) {
  const {
    cdA,
    dvdBlueRayA,
    goodsA,
    photoBookA,
    officialStoreA,
    beautyA,
    specialOrderA,
  } = data;

  db.collection("accounts")
    .doc(user.id)
    .update({
      dcAmount: {
        cdA: Number(Number(cdA).toFixed(2)),
        dvdBlueRayA: Number(Number(dvdBlueRayA).toFixed(2)),
        goodsA: Number(Number(goodsA).toFixed(2)),
        photoBookA: Number(Number(photoBookA).toFixed(2)),
        officialStoreA: Number(Number(officialStoreA).toFixed(2)),
        beautyA: Number(Number(beautyA).toFixed(2)),
        specialOrderA: Number(Number(specialOrderA).toFixed(2)),
      },
    });
  alert("할인액 수정 완료");
}

// 할인율 저장
export function saveDcRates(user, data) {
  const {
    cd,
    dvdBlueRay,
    goods,
    photoBook,
    officialStore,
    beauty,
    specialOrder,
  } = data;

  db.collection("accounts")
    .doc(user.id)
    .update({
      dcRates: {
        cd: Number((Number(cd) / 100).toFixed(2)),
        dvdBlueRay: Number((Number(dvdBlueRay) / 100).toFixed(2)),
        photoBook: Number((Number(goods) / 100).toFixed(2)),
        goods: Number((Number(photoBook) / 100).toFixed(2)),
        officialStore: Number((Number(officialStore) / 100).toFixed(2)),
        beauty: Number((Number(beauty) / 100).toFixed(2)),
        specialOrder: Number((Number(specialOrder) / 100).toFixed(2)),
      },
    });
  alert("할인율 수정 완료");
}
