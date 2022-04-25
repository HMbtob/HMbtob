import React, { useContext } from "react";
import { InitDataContext } from "../../../../App";
import { db } from "../../../../firebase";
import useInputs from "../../../../hooks/useInput";
import { CustomerDcAmount } from "./CustomerDcAmount";
import { CustomerDcRate } from "./CustomerDcRate";
import { CustomerShippingRate } from "./CustomerShippingRate";
import { CustomerSurvay } from "./CustomerSurvay";

export function CustomerDetails({ match }) {
  const { uid } = match.params;
  const state = useContext(InitDataContext);
  const { accounts, dhlShippingFee } = state;
  const { z } = dhlShippingFee;

  const user = accounts.find((account) => account.data.uid === uid);
  const inCharges = accounts.filter((account) => account.data.type === "admin");

  const countries = [].concat(
    ...z
      ?.map((zo) => Object.values(zo).map((co) => co.country))
      .map((doc) => [].concat(...doc))
  );

  const [form, onChange] = useInputs({
    type: user?.data.type,
    recipientEmail: user?.data.recipientEmail,
    recipientPhoneNumber: user?.data.recipientPhoneNumber,
    street: user?.data.street,
    city: user?.data.city,
    states: user?.data.states,
    country: user?.data.country,
    zipcode: user?.data.zipcode,
    recipient: user?.data.recipient,
    shippingMessage: user?.data.shippingMessage,
    taxId: user.data.taxId || "",
    companyName: user.data.companyName || "",
    // 담당자
    inCharge: user?.data.inCharge,
    // 정률법
    cd: Number((user?.data.dcRates.cd * 100).toFixed(2)),
    dvdBlueRay: Number((user?.data.dcRates.dvdBlueRay * 100).toFixed(2)),
    goods: Number((user?.data.dcRates.goods * 100).toFixed(2)),
    photoBook: Number((user?.data.dcRates.photoBook * 100).toFixed(2)),
    officialStore: Number((user?.data.dcRates.officialStore * 100).toFixed(2)),
    beauty: Number((user?.data.dcRates.beauty * 100).toFixed(2)),
    specialOrder: Number((user?.data.dcRates.specialOrder * 100).toFixed(2)),
    // 추후 기입
    dhl: user?.data.shippingRate.dhl,
    nickName: user?.data.nickName,
    memo: user?.data.memo,
    // 커런시
    currency: user?.data.currency,
    // alias
    alias: user?.data.alias,
  });

  const {
    type,
    recipientEmail,
    recipientPhoneNumber,
    street,
    city,
    states,
    country,
    zipcode,
    recipient,
    shippingMessage,
    inCharge,
    dhl,
    nickName,
    memo,
    currency,
    alias,
    taxId,
    companyName,
  } = form;

  const shippingRate = { dhl };

  const saveDetails = () => {
    db.collection("accounts").doc(user.id).update({
      recipientEmail,
      recipientPhoneNumber,
      street,
      city,
      states,
      country,
      zipcode,
      recipient,
      shippingMessage,
      nickName,
      inCharge,
      memo,
      type,
      currency,
      alias,
      taxId,
      companyName,
    });
    alert("수정 완료");
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20 flex items-center">
        <div className="text-center text-md bg-gray-800 rounded-sm text-gray-100 mb-5 w-full">
          USER DETAILS{" "}
        </div>
        {type === "none" ||
        inCharge.length < 1 ||
        nickName.length < 1 ||
        shippingRate.dhl < 1 ? (
          <div className="flex flex-col items-end text-xs mb-3 rounded-md">
            <div className="bg-red-100 w-auto px-2 py-1 rounded-sm mb-1">
              Permission, In Charge, Nick name, 배송요율을 설정해주세요
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col flex space-y-2 w-1/2">
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Email</div>
              <div>{user.id}</div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Permission</div>
              <select
                name="type"
                className={`${type === "none" ? "bg-red-100" : ""} border p-1`}
                value={type}
                onChange={onChange}
              >
                <option value="">권한선택</option>
                <option value="none">none</option>
                <option value="customer">customer</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Name</div>
              <div>{user.data.displayName}</div>
            </div>

            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Number</div>
              {user.data.phoneNumber}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Member since</div>
              {user?.data?.createdAt &&
                new Date(user?.data?.createdAt.toDate()).toLocaleString()}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">In Charge</div>
              <select
                name="inCharge"
                className={`${
                  inCharge.length < 1 ? "bg-red-100" : ""
                } border p-1`}
                value={inCharge}
                onChange={onChange}
              >
                <option>담당자선택</option>
                {inCharges &&
                  inCharges.map((inCharge, index) => (
                    <option key={index} value={inCharge.id}>
                      {inCharge.id}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Currency</div>
              <select
                name="currency"
                value={currency}
                onChange={onChange}
                className="border p-1"
              >
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SGD">SGD</option>
                <option value="JPY">JPY</option>
                <option value="CNY">CNY</option>
              </select>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Nick name</div>
              <input
                name="nickName"
                value={nickName}
                onChange={onChange}
                className={`${
                  nickName.length < 1 ? "bg-red-100" : ""
                } border p-1`}
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Alias</div>
              <input
                name="alias"
                value={alias}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Memo About Customer</div>
              <textarea
                name="memo"
                cols="40"
                rows="5"
                value={memo}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col flex space-y-2">
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Company Name</div>
              <input
                name="companyName"
                value={companyName}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Tax Id</div>
              <input
                name="taxId"
                value={taxId}
                onChange={onChange}
                className="border p-1"
                placeholder="Optional"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Recipient Email</div>
              <input
                name="recipientEmail"
                value={recipientEmail}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Recipient PhoneNumber</div>
              <input
                name="recipientPhoneNumber"
                value={recipientPhoneNumber}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Street</div>
              <input
                name="street"
                value={street}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">City</div>
              <input
                name="city"
                value={city}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">State</div>
              <input
                name="states"
                value={states}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Country</div>
              <select
                name="country"
                value={country}
                onChange={onChange}
                className="border p-1 pl-2"
              >
                {countries.sort().map((co, i) => (
                  <option key={i} value={co}>
                    {co}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Zipcode</div>
              <input
                name="zipcode"
                value={zipcode}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Recipient</div>
              <input
                name="recipient"
                value={recipient}
                onChange={onChange}
                className="border p-1"
              />{" "}
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-right pr-5">Shipping Message</div>
              <textarea
                rows="5"
                cols="30"
                name="shippingMessage"
                value={shippingMessage}
                onChange={onChange}
                className="border p-1"
              ></textarea>
            </div>
          </div>
        </div>
        <button
          onClick={saveDetails}
          className="bg-gray-600 text-white py-1 px-12 rounded mb-12"
        >
          수정하기
        </button>
        <CustomerDcAmount user={user} />
        <CustomerDcRate user={user} />

        <CustomerShippingRate user={user} />
        {user.data.survay && <CustomerSurvay user={user} />}
      </div>
    </div>
  );
}
