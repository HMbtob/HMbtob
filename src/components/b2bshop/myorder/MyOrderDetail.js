import React, { useContext } from "react";
import { InitDataContext } from "../../../App";
import ShippingList from "../../admin/shipping/ShippingList";
import MyOrderDetailRow from "./MyOrderDetailRow";
import CancelIcon from "@material-ui/icons/Cancel";
import UndoIcon from "@material-ui/icons/Undo";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";

const MyOrderDetail = ({ match }) => {
  const { id } = match.params;
  const state = useContext(InitDataContext);
  const { orders, accounts, shippings } = state;

  const order = orders.find(order => order.id === id);
  const account = accounts.find(account => account.id === order.data.customer);
  const shipping = shippings.filter(shipping => shipping.data.orderId === id);

  return (
    <div className="w-full h-full flex justify-center">
      {/* dep-2 */}
      <div className="w-11/12 flex-col mt-20">
        {/* dep-3-1 */}
        <div
          className="text-center text-md bg-gray-800 
        rounded-sm text-gray-100 mb-5 w-full font-semibold"
        >
          My Order
        </div>

        <div className="flex flex-row justify-evenly">
          {/* 주문내용 확인 */}
          <div className="flex-col mb-10 flex space-y-3 w-1/3">
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Order Number</div>
              <div>{order.data.orderNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Order Status</div>
              <div>{order.data.orderState}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">E-MAIL</div>
              <div>{account.id}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Order Date</div>
              {new Date(order?.data.createdAt.toDate()).toLocaleString()}
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Payment Method</div>
              <div>{order?.data.paymentMethod}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Shipping Type</div>
              <div>{order?.data.shippingType}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Phone Number</div>
              <div>{account?.data.phoneNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Company Name</div>
              <div>{account?.data.companyName}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Tax Id</div>
              <div>{account?.data.taxId}</div>
            </div>
          </div>
          {/* 수령인 파트 */}

          <div className="flex-col mb-10 flex space-y-3 w-1/3">
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Recipient</div>
              <div>{order?.data.recipient}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Email</div>
              <div>{order?.data.recipientEmail}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Number</div>
              <div>{order?.data.recipientPhoneNumber}</div>
            </div>
            {order?.data.country !== "korea" ? (
              <>
                <div className="grid grid-cols-2">
                  <div className="text-right pr-5">Street</div>
                  <div>{order?.data.street}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-right pr-5">City</div>
                  <div>{order?.data.city}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-right pr-5">State</div>
                  <div>{order?.data.states}</div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2">
                  <div className="text-right pr-5">Address</div>
                  <div>{order?.data.address}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="text-right pr-5">Detail Address</div>
                  <div>{order?.data.detailAddress}</div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Country</div>
              <div>{order?.data.country}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Zipcode</div>
              <div>{order?.data.zipcode}</div>
            </div>

            <div className="grid grid-cols-2">
              <div className="text-right pr-5">Shipping Message</div>
              <div>{order?.data.shippingMessage}</div>
            </div>
          </div>
        </div>
        <div className="w-full text-center font-semibold mb-2">
          Ordered Items
        </div>
        <div className="flex flex-col items-end text-xs mb-3 rounded-md">
          <div className="bg-red-100 w-44 pl-3 rounded-md mb-1">
            &nbsp;&nbsp;&nbsp;&nbsp;: Items not yet released{" "}
          </div>
          <div className="bg-gray-100 w-44 pl-3 rounded-md  mb-1">
            <CancelIcon style={{ fontSize: "small" }} />: canceled item
          </div>
          <div className="bg-green-100 w-44 pl-3 rounded-md  mb-1">
            <UndoIcon style={{ fontSize: "small" }} />: moved item
          </div>
          <div className="bg-blue-100 w-44 pl-3 rounded-md  mb-1">
            <LocalAirportIcon style={{ fontSize: "small" }} />: shipped item
          </div>
        </div>
        {/* dep-3-3 */}
        <div
          className="grid grid-cols-28 text-center bg-gray-800
            text-xs py-1 rounded-sm text-gray-100 font-semibold"
        >
          <div className="col-span-3">No.</div>
          <div className="col-span-3">DATE</div>
          <div className="col-span-3">RELEASE</div>
          <div className="col-span-13">TITLE</div>
          <div className="col-span-2">PRICE</div>
          <div className="col-span-2">EA</div>

          <div className="col-span-2">AMOUNT</div>
        </div>
        {order &&
          order.data.list.map(doc => (
            <MyOrderDetailRow
              key={doc.childOrderNumber}
              id={doc.childOrderNumber}
              order={doc}
              orderr={order}
              currency={order.data.currency}
              list={order.data.list}
            />
          ))}
        <div className="text-right flex flex-col items-end mt-6 text-lg">
          <div className="grid grid-cols-2 w-96 mb-3">
            <div>PRICE</div>
            <div>
              {order?.data.totalPrice.toLocaleString("ko-KR")}{" "}
              {order?.data.currency}
            </div>
          </div>

          <div className="grid grid-cols-2 w-96  mb-3">
            <div>SHIPPING FEE</div>
            <div>
              {order?.data.shippingFee.toLocaleString("ko-KR")}{" "}
              {order?.data.currency}
            </div>
          </div>
          <div className="grid grid-cols-2 w-96 ">
            <div>TOTAL PRICE</div>
            <div>
              {order?.data.amountPrice.toLocaleString("ko-KR")}{" "}
              {order?.data.currency}
            </div>
          </div>
        </div>
        <ShippingList shipping={shipping} from="myorder" />
      </div>
    </div>
  );
};

export default MyOrderDetail;
