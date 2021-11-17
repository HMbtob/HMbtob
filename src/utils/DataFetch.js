import { db } from "../firebase";

export function AccountsData(setter) {
  db.collection("accounts").onSnapshot(snapshot =>
    setter(snapshot.docs.map(doc => ({ id: doc?.id, data: doc?.data() })))
  );
}
