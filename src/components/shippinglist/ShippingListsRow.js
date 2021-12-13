import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { toDate } from "../../utils/shippingUtils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { HiddenRow } from "./HiddenRow";
import BuildIcon from "@mui/icons-material/Build";
import { CSVLinkComponent } from "./CSVLinkComponent";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { Link } from "react-router-dom";

export function ShippingListsRow({ shipping, hiddenAll, users }) {
  // const sort = orderListInShippings?.length;
  // const totalQty = orderListInShippings?.reduce((a, c) => {
  //   return a + c.data.quan;
  // }, 0);

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

  useEffect(() => {
    // async function fetchList() {
    //   setOrderListInShippings([]);
    //   await users.map(async user =>
    //     db
    //       .collection("accounts")
    //       .doc(user.id)
    //       .collection("shippingsInAccount")
    //       .doc(shipping.id)
    //       .collection("orderListInShippings")
    //       .onSnapshot(snapshot =>
    //         setOrderListInShippings(ps => [
    //           ...ps,
    //           ...snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })),
    //         ])
    //       )
    //   );
    // }
    // fetchList();
  }, [shipping, users]);
  return (
    <div className="border-b border-r border-l w-full border-gray-500">
      <div
        className="text-xs place-items-center grid 
      grid-cols-12 grid-flow-col text-center border-b 
       py-1 bg-white"
      >
        <div>{shipping.data.shippingNumber}</div>
        <div>{toDate(shipping.data.shippedDate.seconds)}</div>
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
                onChange={e => setTrackingNumber(e.target.value)}
                className="w-full outline-none py-1 px-1"
                onKeyPress={e => {
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
          {/* <Link
            to={{
              pathname: "/invoice2",
              // state: checkedInputs,
              // orders,
              // order,
            }}
          >
            <AssignmentOutlinedIcon />
          </Link> */}
        </div>
        <div>{shipping.data.shippingType}</div>
        <div>{shipping.data.country} </div>
        <div></div>
        <div></div>
        {/* <div>{sort && sort} type</div> */}
        {/* <div>{totalQty && totalQty} ea</div> */}
        <div>
          {Number(shipping.data.itemsPrice).toLocaleString()}{" "}
          {shipping.data.currency}
        </div>
        <div>
          {Number(shipping.data.shippingFee).toLocaleString()}{" "}
          {shipping.data.currency}
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
