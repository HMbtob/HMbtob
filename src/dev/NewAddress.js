import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export function NewAddress() {
  const [accounts, setAccounts] = useState([]);

  const ids = ["#1", "#2", "#3", "defaultAddress", "shipToKorea"];
  const de = {
    address: "",
    city: "",
    country: "",
    detailAddress: "",
    name: "Default Address",
    paymentMethod: "",
    recipient: "",
    recipientEmail: "",
    recipientPhoneNumber: "",
    shippingType: "",
    states: "",
    street: "",
    zipcode: "",
  };
  const one = {
    address: "",
    city: "",
    country: "",
    detailAddress: "",
    name: "# 1",
    paymentMethod: "",
    recipient: "",
    recipientEmail: "",
    recipientPhoneNumber: "",
    shippingType: "",
    states: "",
    street: "",
    zipcode: "",
  };
  const two = {
    address: "",
    city: "",
    country: "",
    detailAddress: "",
    name: "# 2",
    paymentMethod: "",
    recipient: "",
    recipientEmail: "",
    recipientPhoneNumber: "",
    shippingType: "",
    states: "",
    street: "",
    zipcode: "",
  };
  const three = {
    address: "",
    city: "",
    country: "",
    detailAddress: "",
    name: "# 3",
    paymentMethod: "",
    recipient: "",
    recipientEmail: "",
    recipientPhoneNumber: "",
    shippingType: "",
    states: "",
    street: "",
    zipcode: "",
  };
  const ko = {
    address: "",
    detailAddress: "",
    name: "Ship To Korea",
    paymentMethod: "",
    recipient: "",
    recipientEmail: "",
    recipientPhoneNumber: "",
    shippingType: "",
    zipcode: "",
  };

  const asdasd = () => {
    console.log(accounts);
    accounts.map(async acc =>
      db
        .collection("accounts")
        .doc(acc.id)
        .collection("addresses")
        .doc(ids[0])
        .set(one)
    );
    accounts.map(async acc =>
      db
        .collection("accounts")
        .doc(acc.id)
        .collection("addresses")
        .doc(ids[1])
        .set(two)
    );
    accounts.map(async acc =>
      db
        .collection("accounts")
        .doc(acc.id)
        .collection("addresses")
        .doc(ids[2])
        .set(three)
    );
    accounts.map(async acc =>
      db
        .collection("accounts")
        .doc(acc.id)
        .collection("addresses")
        .doc(ids[3])
        .set(de)
    );
    accounts.map(async acc =>
      db
        .collection("accounts")
        .doc(acc.id)
        .collection("addresses")
        .doc(ids[4])
        .set(ko)
    );
  };

  useEffect(() => {
    db.collection("accounts").onSnapshot(snapshot =>
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
    );
  }, []);
  return (
    <div>
      <button onClick={() => asdasd()}>addddddddddddddd</button>
    </div>
  );
}
