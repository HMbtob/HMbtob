import React from "react";
import { ByDate } from "./ByDate";

export function FirstContainer({ lifetime, orderQty, byDate }) {
  return (
    <div className="flex flex-row w-full items-center mt-5">
      {/* left */}
      {lifetime && (
        <div className="w-1/5 pl-10">
          <div className="p-5">
            <div className="text-xl font-bold text-red-700">Lifetime Sales</div>
            <div className="font-semibold">
              {Number(lifetime.totalPrice.toFixed(0)).toLocaleString()} KRW
            </div>
          </div>
          <div className="p-5">
            <div className="text-xl font-bold text-red-700">Average Order</div>
            <div className="font-semibold">
              {Number(
                (lifetime.totalPrice / orderQty).toFixed(0)
              ).toLocaleString()}{" "}
              KRW
            </div>
          </div>
        </div>
      )}

      {/* right */}
      <div className="w-4/5 flex items-center ">
        <ByDate byDate={byDate} />
      </div>
    </div>
  );
}
