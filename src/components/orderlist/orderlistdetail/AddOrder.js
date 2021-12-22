import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../../firebase";
import { ErrorMessage } from "@hookform/error-message";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export function AddOrder({ id, from }) {
  const [user, setUser] = useState("");
  const [exchangeRate, setExchangeRate] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    db.collection("accounts")
      .doc(id)
      .collection("order")
      .doc()
      .set({
        addName: "default Address",
        barcode: data.barcode,
        canceled: false,
        category: "cd",
        country: user?.country || "Albania (AL)",
        createdAt: new Date(),
        currency: user?.currency || "KRW",
        dcAmount: 0,
        dcRate: 0,
        exchangeRate,
        moved: false,
        memo: data.memo || "",
        nickName: user?.nickName || "customer",
        preOrderDeadline: new Date(),
        price: data.price,
        productId: "AddOrder",
        quan: data.ea,
        relDate: new Date(),
        shipped: false,
        shippingType: "dhl",
        sku: "AddOrder",
        title: data.title,
        totalPrice: data.price * data.ea,
        totalWeight: 1,
        userId: id,
        userUid: user?.uid || id,
        weight: 1,
        pickingUp: from === "picking" ? true : false,
      });
    reset();
  };

  useEffect(() => {
    db.collection("accounts")
      .doc(id)
      .onSnapshot(snapshot => setUser(snapshot.data()));
    db.collection("exchangeRate")
      .doc("rates")
      .onSnapshot(snapshot => setExchangeRate(snapshot.data()));
  }, [id]);
  return (
    <div className="grid grid-cols-36 text-center border-r border-b border-l py-1 mb-20">
      <div>
        <button type="button" onClick={handleSubmit(onSubmit)}>
          <AddCircleOutlineIcon />{" "}
        </button>
      </div>
      <div className="col-span-10"></div>
      <div className="col-span-3">
        <input
          {...register("barcode", {
            required: { value: true, message: "필수 입력 항목입니다." },
            minLength: { value: 1, message: "너무 짧습니다." },
            maxLength: { value: 30, message: "너무 길게 작성되었습니다." },
          })}
          type="text"
          placeholder="barcode"
          className="text-center text-gray-800 outline-none w-full border"
        />
        <ErrorMessage
          errors={errors}
          name="barcode"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-11">
        <input
          {...register("title", {
            required: { value: true, message: "필수 입력 항목입니다." },
            minLength: { value: 1, message: "너무 짧습니다." },
            maxLength: { value: 100, message: "너무 길게 작성되었습니다." },
          })}
          type="text"
          placeholder="title"
          className="text-left text-gray-800 outline-none w-full border pl-2"
        />
        <ErrorMessage
          errors={errors}
          name="title"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-3">
        <input
          {...register("price", {
            required: { value: true, message: "필수 입력 항목입니다." },
            minLength: { value: 1, message: "너무 짧습니다." },
            maxLength: { value: 100, message: "너무 길게 작성되었습니다." },
          })}
          type="number"
          placeholder="price"
          className="text-left text-gray-800 outline-none w-full border pl-2"
        />
        <ErrorMessage
          errors={errors}
          name="price"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-1">
        <input
          {...register("ea", {
            required: { value: true, message: "필수 입력 항목입니다." },
            minLength: { value: 1, message: "너무 짧습니다." },
            maxLength: { value: 100, message: "너무 길게 작성되었습니다." },
          })}
          type="number"
          placeholder="ea"
          className="text-left text-gray-800 outline-none w-full border pl-2"
        />
        <ErrorMessage
          errors={errors}
          name="ea"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-3"></div>
      <div className="col-span-4">
        <input
          {...register("memo", {
            minLength: { value: 1, message: "너무 짧습니다." },
            maxLength: { value: 100, message: "너무 길게 작성되었습니다." },
          })}
          type="text"
          placeholder="memo"
          className="text-left text-gray-800 outline-none w-full border pl-2"
        />
        <ErrorMessage
          errors={errors}
          name="memo"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
    </div>
  );
}
