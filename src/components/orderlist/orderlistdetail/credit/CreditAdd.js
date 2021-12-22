import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { db } from "../../../../firebase";

export function CreditAdd({ id, lastBalance, user }) {
  const today = new Date();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      plus: 0,
      minus: 0,
      createdAt: today.toISOString().substring(0, 10),
    },
  });
  const onSubmit = async data => {
    try {
      await db
        .collection("accounts")
        .doc(id)
        .collection("credit")
        .doc()
        .set({
          createdAt: new Date(data.createdAt),
          content: data.content,
          currency: user.currency,
          plus: Number(data.plus),
          minus: Number(data.minus),
          balance: Number(lastBalance + Number(data.plus) - Number(data.minus)),
          memo: data.memo || "",
        });
    } catch (e) {
      console.log(e);
    }
    reset();
  };

  return (
    <div
      className="grid grid-cols-20  grid-flow-col text-cente
       text-gray-900 py-1 rounded-sm text-sm items-center mb-2 mt-10"
    >
      <button type="button" onClick={handleSubmit(onSubmit)}>
        <AddCircleOutline />
      </button>
      <div className="col-span-3">
        <input
          {...register("createdAt", {
            required: { value: true, message: "필수 항목 입니다." },
            maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
          })}
          type="date"
          className="text-left py-1 pl-2 text-gray-800 outline-none border bg-transparent w-full"
        />
        <ErrorMessage
          errors={errors}
          name="createdAt"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-4">
        <input
          {...register("content", {
            required: { value: true, message: "필수 항목 입니다." },
            maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
          })}
          type="text"
          placeholder="content"
          className="text-left py-1 pl-2 text-gray-800 outline-none w-full border bg-transparent"
        />
        <ErrorMessage
          errors={errors}
          name="content"
          render={({ message }) => (
            <div className="text-center font-semibold w-full text-red-600 mb-5">
              {message}
            </div>
          )}
        />
      </div>
      <div className="col-span-3 flex flex-row border items-center justify-center">
        <div className="">+</div>

        <input
          {...register("plus", {
            required: { value: true, message: "값을 입력해 주세요." },
            maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
          })}
          type="number"
          placeholder="plus"
          className="text-center py-1 pl-2 text-gray-800 outline-none w-1/2  bg-transparent"
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="plus"
        render={({ message }) => (
          <div className="text-center font-semibold w-full text-red-600 mb-5">
            {message}
          </div>
        )}
      />
      <div className="col-span-3 flex flex-row border items-center justify-center">
        <div className="">-</div>

        <input
          {...register("minus", {
            required: { value: true, message: "값을 입력해 주세요." },
            maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
          })}
          type="number"
          placeholder="minus"
          className="text-center py-1 pl-2 text-gray-800 outline-none w-1/2  bg-transparent"
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="minus"
        render={({ message }) => (
          <div className="text-center font-semibold w-full text-red-600 mb-5">
            {message}
          </div>
        )}
      />
      <div className="col-span-3"></div>
      <div className="col-span-3">
        <input
          {...register("memo", {
            maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
          })}
          type="text"
          placeholder="memo"
          className="text-left py-1 pl-2 text-gray-800 outline-none w-full border  bg-transparent"
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
