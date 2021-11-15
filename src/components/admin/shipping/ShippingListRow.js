import React, { useState, useContext } from "react";
import { InitDataContext } from "../../../App";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import BuildIcon from "@mui/icons-material/Build";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import HiddenRow from "./HiddenRow";
import { db } from "../../../firebase";

const ShippingListRow = ({ shipping, from, hiddenAll }) => {
  const state = useContext(InitDataContext);
  const { orders } = state;

  const [forHidden, setForHidden] = useState(true);
  const handleHidden = forHidden => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };
  const [checkedInputs, setCheckedInputs] = useState(
    shipping.data.list.map(li => li.childOrderNumber)
  );
  const order = orders.find(order => order.id === shipping.data.orderId);

  const csvData = shipping.data.list.map(li => [
    li.sku,
    li.sku,
    li.title,
    li.barcode,
    "interasia01",
    li.quan,
  ]);

  const today = new Date();
  const date = `${today
    .toLocaleDateString()
    .replaceAll(".", "-")
    .replaceAll(" ", "")}han.csv`;

  const krwComma = (num, cur) => {
    let calNum;
    cur === "KRW"
      ? (calNum = Number(num.toString().replaceAll(",", ""))
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      : (calNum = Number(num.toString().replaceAll(",", ""))
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    return calNum;
  };

  const [forFix, setForFix] = useState(false);
  const handleForFix = () => {
    setForFix(!forFix);
  };
  const [trackingNumber, setTrackingNumber] = useState(
    shipping.data.trackingNumber
  );

  if (shipping) {
    return (
      <div className="border-b border-r border-l w-full border-gray-500">
        <div
          className="text-xs place-items-center grid 
      grid-cols-28 grid-flow-col text-center border-b 
       py-1 bg-white"
        >
          <div className="col-span-3">{shipping?.data?.shippingNumber}</div>
          <div className="col-span-3">
            {new Date(shipping?.data?.shippedDate.toDate()).toLocaleString()}
          </div>
          <div className="col-span-3">
            {shipping?.data?.orderNumber}
            {from !== "myorder" && (
              <>
                <Link
                  to={{
                    pathname: "/invoice",
                    state: checkedInputs,
                    orders,
                    order,
                  }}
                >
                  <AssignmentOutlinedIcon />
                </Link>
                <CSVLink
                  data={csvData}
                  filename={date}
                  target="_blank"
                  className="ml-2"
                >
                  <CalendarViewMonthIcon />
                </CSVLink>
              </>
            )}
          </div>
          <div className="col-span-3">
            {new Date(shipping?.data?.orderCreatedAt.toDate()).toLocaleString()}
          </div>
          {trackingNumber && trackingNumber.split("\n")?.length > 1 ? (
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
              {trackingNumber}
            </div>
          ) : (
            <div className="col-span-2 text-left w-full border bg-white">
              <input
                type="text"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="w-full outline-none py-1 px-1"
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    db.collection("shipping")
                      .doc(shipping.id)
                      .update({ trackingNumber });
                    handleForFix();
                  }
                }}
              />
            </div>
          )}
          <div className="flex flex-row items-center">
            {trackingNumber && trackingNumber.split("\n")?.length < 2 && (
              <BuildIcon
                className="cursor-pointer"
                style={{ fontSize: "medium" }}
                onClick={() => handleForFix()}
              />
            )}

            <ExpandMoreIcon
              className="cursor-pointer mr-3"
              onClick={() => handleHidden(forHidden)}
            />
          </div>
          <div className="col-span-3">
            {shipping.data.nickName
              ? shipping.data.nickName
              : shipping?.data?.customer}
          </div>
          <div>{shipping?.data?.shippingType}</div>
          <div className="col-span-2">{shipping?.data?.country}</div>
          <div className="col-span-1">{shipping?.data?.list.length} type</div>
          <div className="col-span-1">
            {Number(
              shipping?.data?.list.reduce((i, c) => {
                return i + c.quan;
              }, 0)
            )}{" "}
            EA
          </div>
          {/* {from !== "myorder" && ( */}
          <div className="col-span-1">
            {/* {shipping.data.inputWeight && shipping.data.inputWeight > 0
                ? shipping.data.inputWeight
                : Number(
                    shipping?.data?.list.reduce((i, c) => {
                      return i + c.weight * c.quan;
                    }, 0)
                  ) / 1000}{" "}
              KG */}
            {krwComma(shipping.data.checkedItemPrice, shipping.data.currency)}{" "}
            {shipping.data.currency}
          </div>
          {/* )} */}
          <div className="col-span-2">
            {krwComma(shipping.data.checkedItemsFee, shipping.data.currency)}{" "}
            {shipping.data.currency}
          </div>

          <div className="col-span-2">
            {krwComma(
              shipping.data.checkItemAmountPrice,
              shipping.data.currency
            )}{" "}
            {shipping.data.currency}
          </div>
        </div>
        {forHidden && hiddenAll ? "" : <HiddenRow shipping={shipping} />}
      </div>
    );
  }
  return "loading";
};

export default ShippingListRow;
