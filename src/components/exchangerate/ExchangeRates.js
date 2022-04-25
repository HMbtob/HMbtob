import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

export default function ExchangeRates() {
  const [rates, setRates] = useState({
    USD: "",
    EUR: "",
    SGD: "",
    JPY: "",
    CNY: "",
  });

  const { USD, EUR, SGD, JPY, CNY } = rates;

  const handleRates = (e) => {
    const { name, value } = e.target;

    setRates({
      ...rates,
      [name]: Number(value),
    });
  };

  useEffect(() => {
    db.collection("exchangeRate")
      .doc("rates")
      .get()
      .then((doc) => setRates(doc.data()));
  }, []);

  const onSubmit = () => {
    db.collection("exchangeRate").doc("rates").update(rates);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 flex-col mt-20">
        <div
          className="w-full text-center my-4 
        text-gray-800 font-semibold"
        >
          적용 환율
        </div>
        <div className="grid grid-cols-5 border">
          <div className="grid grid-cols-1 text-center">
            <div className="text-gray-100 bg-gray-600">USD</div>
            <div className="items-center border">
              <input
                className="text-center text-gray-800 outline-none bg-transparent"
                type="number"
                value={USD}
                name="USD"
                onChange={(e) => handleRates(e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 text-center">
            <div className="text-gray-100 bg-gray-600">EUR</div>
            <div className="items-center border">
              <input
                className="text-center text-gray-800 outline-none bg-transparent"
                type="number"
                value={EUR}
                name="EUR"
                onChange={(e) => handleRates(e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 text-center">
            <div className="text-gray-100 bg-gray-600">SGD</div>
            <div className="items-center border">
              <input
                className="text-center text-gray-800 outline-none bg-transparent"
                type="number"
                value={SGD}
                name="SGD"
                onChange={(e) => handleRates(e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 text-center">
            <div className="text-gray-100 bg-gray-600">JPY</div>
            <div className="items-center border">
              <input
                className="text-center text-gray-800 outline-none bg-transparent"
                type="number"
                value={JPY}
                name="JPY"
                onChange={(e) => handleRates(e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 text-center">
            <div className="text-gray-100 bg-gray-600">CNY</div>
            <div className="items-center border">
              <input
                className="text-center text-gray-800 outline-none bg-transparent"
                type="number"
                value={CNY}
                name="CNY"
                onChange={(e) => handleRates(e)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onSubmit()}
          type="button"
          className="bg-gray-600 p-1 rounded-sm text-gray-200 m-2 w-32 text-sm"
        >
          수정하기{" "}
        </button>
      </div>
    </div>
  );
}
