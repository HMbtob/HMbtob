import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { saveDcRates } from "../utils/utils";
export function CustomerDcRate({ user }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user.data.dcRates,
  });

  const onSubmit = (data) => {
    saveDcRates(user, data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center my-5"
    >
      <div className="text-center my-1 font-semibold">
        할인율 [ 백분율 ex) 0.25 ]{/* {`[ ${user.data.currency} ]`} */}
      </div>
      <div className="grid grid-cols-7 border">
        {Object.keys(user.data.dcRates)
          .sort()
          .map((li) => (
            <div className="grid grid-cols-1  text-center  ">
              <div className="text-gray-100 bg-gray-600">{li}</div>
              <div className="grid grid-cols-4 items-center border">
                <input
                  step={0.01}
                  {...register(li, {
                    required: { value: true, message: "필수 입력 항목입니다." },
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="text-center text-gray-800 outline-none col-span-3 bg-transparent"
                />{" "}
                <div className="text-xs bg-transparent">{"KRW"}</div>
              </div>
            </div>
          ))}
      </div>
      {Object.keys(user.data.dcRates).map((li) => (
        <ErrorMessage
          errors={errors}
          name={li}
          render={({ message }) => (
            <div className="text-center text-sm font-semibold w-full text-red-600">
              {li}
              {" : "}
              {message}
            </div>
          )}
        />
      ))}
      <button
        type="submit"
        className="bg-gray-600 p-1 rounded-sm text-gray-200 m-2 w-32 text-sm"
      >
        할인율 수정하기{" "}
      </button>
    </form>
  );
}
