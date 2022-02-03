import React from "react";
import { ByDate } from "./ByDate";

export function FirstContainer({ lifetime, orderQty, byDate }) {
  return (
    <div className="flex flex-row w-full items-center mt-12">
      {/* left */}
      {lifetime && (
        <div className="w-1/4">
          <div>
            <div>Lifetime Sales</div>
            <div>
              {Number(lifetime.totalPrice.toFixed(0)).toLocaleString()} KRW
            </div>
          </div>
          <div>
            <div>Average Order</div>
            <div>
              {Number(
                (lifetime.totalPrice / orderQty).toFixed(0)
              ).toLocaleString()}{" "}
              KRW
            </div>
          </div>
        </div>
      )}

      {/* right */}
      <div className="w-3/4">
        <ByDate byDate={byDate} />
      </div>
    </div>
  );
}
