import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { toDate } from "../../utils/shippingUtils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { HiddenRow } from "./HiddenRow";
import BuildIcon from "@mui/icons-material/Build";
import { CSVLinkComponent } from "./CSVLinkComponent";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { Link } from "react-router-dom";
import { CSVInvoice } from "./CSVInvoice";

export function ShippingListsRow({ shipping, hiddenAll }) {
  const [forHidden, setForHidden] = useState(true);
  const handleHidden = () => {
    setForHidden(!forHidden);
  };
  const [trackingNumber, setTrackingNumber] = useState(
    shipping.data.trackingNumber
  );
  const [forFix, setForFix] = useState(false);
  const handleForFix = () => {
    setForFix(!forFix);
  };

  const [date, setDate] = useState(toDate(shipping.data.shippedDate.seconds));

  // 배송비, 총액 수정
  const [shippingFee, setShippingFee] = useState(shipping.data.shippingFee);
  const editShippingFee = async (e) => {
    e.preventDefault();
    try {
      await db
        .collection("accounts")
        .doc(shipping.data.userId)
        .collection("shippingsInAccount")
        .doc(shipping.id)
        .update({
          shippingFee,
          totalAmount: shippingFee + shipping.data.itemsPrice,
        });
      alert("배송비와 총액이 수정되었습니다.");
    } catch (e) {
      console.log("수정을 실패했습니다.");
    }
  };

  return (
    <div className="border-b border-r border-l w-full border-gray-500">
      <div
        className="text-xs place-items-center grid 
      grid-cols-12 grid-flow-col text-center border-b 
       py-1 bg-white"
      >
        <div>{shipping.data.shippingNumber}</div>
        <div>
          {!forFix ? (
            toDate(shipping.data.shippedDate.seconds)
          ) : (
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={(e) => {
                setDate(e.target.value);
                db.collection("accounts")
                  .doc(shipping.data.userId)
                  .collection("shippingsInAccount")
                  .doc(shipping.id)
                  .update({ shippedDate: new Date(e.target.value) });
                handleForFix();
              }}
              value={date}
            />
          )}
        </div>
        <div>{shipping.data.name}</div>
        <div className="flex flex-row items-center">
          {shipping?.data?.trackingNumber?.split(",")?.length > 1 ? (
            <div className="col-span-2">Boxes</div>
          ) : !forFix ? (
            <div
              className="col-span-2 cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${shipping?.data?.trackingNumber}`,
                  "_blank"
                )
              }
            >
              {shipping?.data?.trackingNumber}
            </div>
          ) : (
            <div className="col-span-2 text-left w-full border bg-white">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full outline-none py-1 px-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    db.collection("accounts")
                      .doc(shipping.data.userId)
                      .collection("shippingsInAccount")
                      .doc(shipping.id)
                      .update({ trackingNumber: trackingNumber });
                    handleForFix();
                  }
                }}
              />
            </div>
          )}

          <BuildIcon
            className="cursor-pointer ml-2"
            style={{ fontSize: "medium" }}
            onClick={() => handleForFix()}
          />

          <ExpandMoreIcon
            onClick={() => handleHidden()}
            className="h-5 cursor-pointer"
          />
        </div>
        <div className="flex flex-row items-center">
          {shipping.data.nickName}
          <CSVLinkComponent shipping={shipping} />
          <Link
            to={{
              pathname: "/invoice2",
              // state: checkedInputs,
              // orders,
              shipping,
            }}
          >
            <AssignmentOutlinedIcon />
          </Link>
          <CSVInvoice shipping={shipping} />
        </div>
        <div>{shipping.data.shippingType}</div>
        <div>{shipping.data.country} </div>
        <div></div>

        <div>
          {Number(shipping.data.itemsPrice).toLocaleString()}{" "}
          {shipping.data.currency}
        </div>
        <div className="flex flex-row items-center col-span-2">
          <input
            className="w-full outline-none  text-right"
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
          />
          <div className="text-left">{shipping.data.currency}</div>
          <button
            type="button"
            className="bg-gray-800 text-gray-100 py-1 px-1 rounded-sm cursor-pointer mr-2 w-1/4 ml-1"
            onClick={(e) => editShippingFee(e)}
          >
            수정
          </button>
          {/* {Number(shipping.data.shippingFee).toLocaleString()}{" "} */}
        </div>
        <div>
          {Number(shipping.data.totalAmount).toLocaleString()}{" "}
          {shipping.data.currency}
        </div>
      </div>
      {forHidden && hiddenAll ? "" : <HiddenRow shipping={shipping} />}
    </div>
  );
}
