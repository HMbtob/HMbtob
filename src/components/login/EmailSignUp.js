import React, { useContext } from "react";
import { auth, db } from "../../firebase";
import { InitDataContext } from "../../App";
import useInputs from "../../hooks/useInput";

const EmailSignUp = () => {
  const state = useContext(InitDataContext);
  const { dhlShippingFee } = state;
  const { z } = dhlShippingFee;
  const countries = [].concat(
    ...z
      ?.map(zo => Object.values(zo).map(co => co.country))
      .map(doc => [].concat(...doc))
  );

  const [form, onChange] = useInputs({
    emailRef: "",
    passwordRef: "",
    fullName: "",
    companyName: "",
    country: "",
    address: "",
    phoneNumber: "",
    taxId: "",
    monthly: "",
    payment: "",
    transport: "",
    howToSell: "",
    provider: "",
    requests: "",
  });

  const {
    emailRef,
    passwordRef,
    fullName,
    companyName,
    country,
    address,
    phoneNumber,
    taxId,
    monthly,
    payment,
    transport,
    howToSell,
    provider,
    requests,
  } = form;

  const register = async e => {
    e.preventDefault();
    if (
      emailRef.length > 0 &&
      passwordRef.length > 0 &&
      fullName.length > 0 &&
      companyName.length > 0 &&
      country.length > 0 &&
      address.length > 0 &&
      phoneNumber.length > 0 &&
      monthly.length > 0 &&
      payment.length > 0 &&
      transport.length > 0 &&
      howToSell.length > 0 &&
      provider.length > 0 &&
      requests.length > 0
    ) {
      await auth
        .createUserWithEmailAndPassword(emailRef, passwordRef)
        .then(
          async authUser =>
            await setTimeout(
              () =>
                db
                  .collection("accounts")
                  .doc(authUser.user.email)
                  .update({
                    survay: {
                      fullName: fullName,
                      companyName: companyName,
                      country: country,
                      address: address,
                      phoneNumber: phoneNumber,
                      taxId: taxId,
                      monthly: monthly,
                      payment: payment,
                      transport: transport,
                      howToSell: howToSell,
                      provider: provider,
                      requests: requests,
                    },
                  }),
              10000
            )
        )
        .catch(e => {
          alert(e.message);
        });
    } else {
      alert("필수항목을 입력해주세요.");
    }
  };

  return (
    <form className="flex flex-col items-center" onSubmit={register}>
      <div className="text-2xl font-semibold mb-3">Sign Up</div>
      <div className="flex flex-col w-80">
        <input
          required
          // ref={emailRef}
          name="emailRef"
          type="text"
          placeholder="E-mail"
          onChange={onChange}
          value={emailRef}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <input
          required
          // ref={passwordRef}
          name="passwordRef"
          type="password"
          placeholder="Password"
          onChange={onChange}
          value={passwordRef}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <input
          required
          // ref={fullName}
          name="fullName"
          placeholder="Full Name"
          onChange={onChange}
          value={fullName}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <input
          required
          // ref={companyName}
          name="companyName"
          placeholder="Company Name"
          onChange={onChange}
          value={companyName}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />

        <select
          // ref={country}
          name="country"
          required
          onChange={onChange}
          value={country}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        >
          <option>Country</option>
          {countries.sort().map((co, i) => (
            <option key={i} value={co}>
              {co}
            </option>
          ))}
        </select>
        <input
          required
          // ref={address}
          name="address"
          placeholder="Address"
          onChange={onChange}
          value={address}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <input
          required
          // ref={phoneNumber}
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={onChange}
          value={phoneNumber}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <input
          // ref={taxId}
          name="taxId"
          placeholder="TAX ID(optional)"
          onChange={onChange}
          value={taxId}
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <select
          required
          // ref={monthly}
          name="monthly"
          onChange={onChange}
          value={monthly}
          className="p-1 pl-2 text-sm mt-2 border rounded w-full"
        >
          <option>Monthly Purchase Amount (USD)</option>
          <option value="$0~$5,000">$0~$5,000</option>
          <option value="$5,000~$10,000">$5,000~$10,000</option>
          <option value="Above $10,000">Above $10,000</option>
        </select>
        <select
          required
          // ref={payment}
          name="payment"
          onChange={onChange}
          value={payment}
          className="p-1 pl-2 text-sm mt-2 border rounded w-full"
        >
          <option>Payment methods you want</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card (add 4% Fees)">
            Credit Card (add 4% Fees)
          </option>
          <option value="Paypal (8% Fees)">Paypal (8% Fees)</option>
        </select>
        <select
          required
          // ref={transport}
          name="transport"
          onChange={onChange}
          value={transport}
          className="p-1 pl-2 text-sm mt-2 border rounded w-full"
        >
          <option>What transport method do you prefer?</option>
          <option value="DHL">DHL</option>
          <option value="EMS">EMS</option>
          <option value="Other">Other</option>
        </select>
        <select
          required
          // ref={howToSell}
          name="howToSell"
          onChange={onChange}
          value={howToSell}
          className="p-1 pl-2 text-sm mt-2 border rounded w-full"
        >
          <option>How to Sell</option>
          <option value="On-Line Sales">On-Line Sales</option>
          <option value="Off-line Shop">Off-line Shop</option>
          <option value="Both">Both</option>
        </select>
        <input
          required
          // ref={provider}
          name="provider"
          onChange={onChange}
          value={provider}
          placeholder="Is there a current provider?"
          className="p-1 pl-2 text-sm mt-2 border rounded"
        />
        <textarea
          // ref={requests}
          name="requests"
          required
          cols="30"
          rows="3"
          onChange={onChange}
          value={requests}
          className="p-1 pl-2 text-sm mt-2 border rounded"
          placeholder="Please specify if you have any requests."
        ></textarea>
      </div>
      <button
        type="submit"
        className="text-lg font-semibold bg-gray-400 w-80 p-2 rounded mt-3 text-white"
      >
        Sign Up
      </button>
    </form>
  );
};

export default EmailSignUp;
