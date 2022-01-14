import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export function CustomerDcRate({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user.data.dcRates,
  });

  const onSubmit = data => {
    console.log("user", user);
    console.log("data", data);
    // saveDcRates(user, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1">
      <div className="text-center my-1 font-semibold">DC Rate {`[ % ]`}</div>
      <div className="grid grid-cols-7 border mb-10">
        {Object.keys(user.data.dcRates).map(li => (
          <div className="grid grid-cols-1  bg-gray-600 text-center  ">
            <div className="text-gray-100">{li}</div>
            <input
              {...register(li, {
                required: { value: true, message: "필수 입력 항목입니다." },
              })}
              type="number"
              className="text-center text-gray-800 outline-none"
            />
            <ErrorMessage
              errors={errors}
              name={li}
              render={({ message }) => (
                <div className="text-center font-semibold w-full text-red-600 mb-5">
                  {message}
                </div>
              )}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-gray-600 p-1 rounded text-gray-200 m-2 w-52"
      >
        할인율 수정하기{" "}
      </button>
    </form>
  );
}
