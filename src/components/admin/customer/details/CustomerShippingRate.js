import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { saveShippingRate } from "../utils/utils";

export function CustomerShippingRate({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user.data.shippingRate,
  });

  const onSubmit = data => {
    saveShippingRate(user, data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center my-5"
    >
      <div className="text-center my-1 font-semibold">배송요율 {`[ 원 ]`}</div>
      <div className="grid grid-cols-1 border">
        <div className="grid grid-cols-1  bg-gray-600 text-center  ">
          <div className="text-gray-100">DHL</div>
          <input
            {...register("dhl", {
              required: { value: true, message: "필수 입력 항목입니다." },
              //   pattern: { value: /d*/g, message: "숫자만 입력 가능합니다." },
            })}
            type="text"
            className={`${
              user.data.shippingRate.dhl < 1 ? "bg-red-100" : ""
            } text-center text-gray-800 outline-none`}
          />
          <ErrorMessage
            errors={errors}
            name="dhl"
            render={({ message }) => (
              <div className="text-center font-semibold w-full text-red-600 mb-5">
                {message}
              </div>
            )}
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-gray-600 p-1 rounded-sm text-gray-200 m-2 w-32 text-sm"
      >
        배송요율 수정하기{" "}
      </button>
    </form>
  );
}
