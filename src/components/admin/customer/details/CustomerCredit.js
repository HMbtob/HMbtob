import React, { useState } from "react";
import Modal from "../../../modal/Modal";
import CreditDetails from "../utils/CreditDetails";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { saveCredit } from "../utils/utils";

export function CustomerCredit({ user }) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues: { creditType: "Store-Credit" } });

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const onSubmit = data => {
    saveCredit(user, data);
    resetField("handleCredit");
  };

  return (
    <form
      className="w-1/2 mb-12 flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className="text-center text-md bg-gray-800 
            rounded text-gray-100 mb-5 mt-5 w-full py-1"
      >
        CREDIT
      </div>

      <div className="grid grid-cols-2 text-center mb-3">
        <div>CREDIT :</div>
        <div>
          {Math.round(user.data.credit).toLocaleString("ko-KR")}{" "}
          {user.data.currency}
        </div>
      </div>
      <div className="grid grid-cols-2">
        <Modal open={modalOpen} close={closeModal} header={"CREDIT DETAILS"}>
          <CreditDetails creditDetails={user.data.creditDetails} />
        </Modal>

        <select
          {...register("creditType", {
            required: { value: true, message: "필수 입력 항목입니다." },
          })}
          className="border p-1 m-1"
        >
          <option value="Store-Credit">Store-Credit</option>
          <option value="Shipped-Amount">Shipped-Amount</option>
          <option value="Refund">Refund</option>
          <option value="Compensate">Compensate</option>
          <option value="Adjustment">Adjustment</option>
        </select>
        <input
          {...register("handleCredit", {
            required: { value: true, message: "필수 입력 항목입니다." },
            maxLength: { value: 20, message: "너무 큰 숫자입니다." },
            minLength: { value: 1, message: "너무 작은 숫자입니다." },
          })}
          type="number"
          placeholder="Credits"
          className="border p-1 m-1 outline-none pl-2"
        />
      </div>
      <ErrorMessage
        errors={errors}
        name="handleCredit"
        render={({ message }) => (
          <div className="text-center font-semibold w-full text-red-600 mb-5">
            {message}
          </div>
        )}
      />
      <button
        type="button"
        className="bg-gray-600 p-1 rounded text-gray-200 m-2 w-52"
        onClick={() => openModal()}
      >
        Credit Details
      </button>
    </form>
  );
}
