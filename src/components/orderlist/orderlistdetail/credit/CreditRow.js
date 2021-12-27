import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { toDate } from "../../../../utils/shippingUtils";
import { useState } from "react";
import BuildIcon from "@mui/icons-material/Build";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../../../firebase";
export function CreditRow({ credit, id, user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: credit.data.content,
      plus: credit.data.plus,
      minus: credit.data.minus,
      memo: credit.data.memo,
    },
  });

  const [fix, setFix] = useState(false);
  const handleFix = () => {
    setFix(!fix);
  };

  const onSubmit = async data => {
    try {
      await db
        .collection("accounts")
        .doc(id)
        .collection("credit")
        .doc(credit.id)
        .update({
          content: data.content,
          currency: user.currency,
          plus: Number(data.plus),
          minus: Number(data.minus),
          memo: data.memo || "",
        });
      alert("수정되었습니다.");
      handleFix();
    } catch (e) {
      console.log(e);
    }
  };

  const onDel = async () => {
    try {
      if (window.confirm("삭제하시겠습니까?")) {
        await db
          .collection("accounts")
          .doc(id)
          .collection("credit")
          .doc(credit.id)
          .delete();
        alert("삭제되었습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return fix ? (
    <>
      <div
        className="grid grid-cols-20  grid-flow-col text-center
         text-gray-900 rounded-sm text-sm items-center
         border-b border-l border-r"
      >
        <div>
          <button type="button" onClick={handleSubmit(onSubmit)}>
            <BuildIcon style={{ color: "gray" }} />
          </button>
        </div>
        <div className="col-span-3 border-r py-1">
          {toDate(credit.data.createdAt.seconds)}
        </div>
        <div className="col-span-4 border-r py-1">
          <input
            {...register("content", {
              required: { value: true, message: "필수 항목 입니다." },
              maxLength: { value: 500, message: "너무 길게 작성되었습니다." },
            })}
            type="text"
            placeholder="content"
            className="text-left pl-2 text-gray-800 outline-none w-full bg-transparent"
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
        <div className="col-span-3 flex flex-col items-center justify-center border-r">
          <div className="flex flex-row items-center justify-center">
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
        </div>
        <div className="col-span-3 flex flex-col items-center justify-center border-r">
          <div className="flex flex-row items-center justify-center">
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
        </div>
        <div className="col-span-3 border-r py-1">
          {credit.data.balance.toLocaleString()} {credit.data.currency}
        </div>
        <div className="col-span-3">{credit.data.memo}</div>
      </div>
    </>
  ) : (
    <div
      className="grid grid-cols-20  grid-flow-col text-center
         text-gray-900 rounded-sm text-sm items-center
         border-b border-l border-r"
    >
      <div>
        <button type="button" onClick={() => handleFix()}>
          <BuildIcon />
        </button>
        <button type="button" onClick={handleSubmit(onDel)}>
          <DeleteIcon />
        </button>
      </div>
      <div className="col-span-3 border-r py-1">
        {toDate(credit.data.createdAt.seconds)}
      </div>
      <div className="col-span-4 border-r py-1">{credit.data.content}</div>
      <div className="col-span-3 border-r py-1">
        + {credit.data.plus.toLocaleString()} {credit.data.currency}
      </div>
      <div className="col-span-3 border-r py-1">
        - {credit.data.minus.toLocaleString()} {credit.data.currency}
      </div>
      <div className="col-span-3 border-r py-1">
        {credit.data.balance.toLocaleString()} {credit.data.currency}
      </div>
      <div className="col-span-3">{credit.data.memo}</div>
    </div>
  );
}
