import React, { useState } from "react";
import { db } from "../../../../firebase";
import useInputs from "../../../../hooks/useInput";
import Modal from "../../../modal/Modal";
import CreditDetails from "../utils/CreditDetails";
import firebase from "firebase";
import { useForm } from "react-hook-form";

export function CustomerCredit({ user }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [form, onChange, reset, credit_reset] = useInputs({
    handleCredit: 0,
    creditType: "Store-Credit",
  });

  const { handleCredit, creditType } = form;

  const saveCredit = () => {
    if (handleCredit === 0) {
      alert("올바른 숫자를 입력해 주세요");
    }
    db.collection("accounts")
      .doc(user.id)
      .update({
        credit: Number(user.data.credit) + Number(handleCredit),
        creditDetails: firebase.firestore.FieldValue.arrayUnion({
          type: creditType,
          amount: Number(handleCredit),
          currency: user.data.currency,
          date: new Date(),
          totalAmount: Number(user.data.credit) + Number(handleCredit),
        }),
      });
    credit_reset();
  };
  return (
    <div className="w-1/2 mb-12 flex flex-col items-center">
      <div
        className="text-center text-md bg-gray-800 
            rounded text-gray-100 mb-5 mt-5 w-full py-1"
      >
        CREDIT
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="test" {...register("example")} />

        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("exampleRequired", { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" />
      </form>
      <div className="grid grid-cols-2 text-center mb-3">
        <div>CREDIT :</div>
        <div>
          {Math.round(user.data.credit).toLocaleString("ko-KR")}{" "}
          {user.data.currency}
        </div>
      </div>
      <div className="grid grid-cols-2 mb-6">
        <Modal open={modalOpen} close={closeModal} header={"CREDIT DETAILS"}>
          <CreditDetails
            creditDetails={user.data.creditDetails}
            reset={reset}
          />
        </Modal>

        <select
          name="creditType"
          className="border p-1 m-1"
          value={creditType}
          onChange={onChange}
        >
          <option value="Store-Credit">Store-Credit</option>
          <option value="Shipped-Amount">Shipped-Amount</option>
          <option value="Refund">Refund</option>
          <option value="Compensate">Compensate</option>
          <option value="Adjustment">Adjustment</option>
        </select>
        <input
          type="number"
          name="handleCredit"
          value={handleCredit}
          onChange={onChange}
          placeholder="Amount"
          className="border p-1 m-1 outline-none"
          onKeyPress={e => {
            if (e.key === "Enter") {
              saveCredit();
              return false;
            }
          }}
        />
      </div>
      <button
        className="bg-gray-600 p-1 rounded text-gray-200 m-2 w-52"
        onClick={openModal}
      >
        Credit Details
      </button>
    </div>
  );
}
