import { db } from "../../../firebase";

export function handleDelete(account) {
  let con = window.confirm("정말로 삭제하시겠습니까?");
  if (con === true) {
    db.collection("accounts").doc(account.id).delete();
  } else if (con === false) {
    return;
  }
}
