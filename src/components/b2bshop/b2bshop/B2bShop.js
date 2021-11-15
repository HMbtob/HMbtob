import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { InitDataContext, InitDispatchContext } from "../../../App";
import { db } from "../../../firebase";
import { Common } from "../common/Common";
import NoticeTable from "../notice/NoticeTable";
import PreOrderTable from "../preorder/PreOrderTable";
import SimpleList from "../simplelist/SimpleList";
import useSimpleList from "../../../hooks/useSimpleList";
import DealTable from "../deal/DealTable";
import Modal from "../../modal/Modal";
import InSimpleList from "../../chat/InSimpleList";
import SearchIcon from "@material-ui/icons/Search";
import RestoreIcon from "@material-ui/icons/Restore";
import { useEffect } from "react";

const B2bShop = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const dispatch = useContext(InitDispatchContext);
  const { notices, products, user, exchangeRate, orders, rooms } = state;
  const today = new Date();
  const [query, setQuery] = useState();
  const queryOnChange = e => {
    const { value } = e.target;
    setQuery(value);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  // order number를 위한 0 포함된 숫자 만드는 함수
  const addZeros = (n, digits) => {
    let zero = "";
    n = n.toString();
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };
  // order number를 위한 마지막 3자리 숫자 만들기
  const forOrderNumber = orders
    ?.filter(order => order.data.customer === user?.email)
    .filter(
      order =>
        new Date(order.data.createdAt.seconds * 1000)
          .toISOString()
          .substring(0, 10) === new Date(today).toISOString().substring(0, 10)
    )
    ? orders
        .filter(order => order.data.customer === user?.email)
        .filter(
          order =>
            new Date(order.data.createdAt.seconds * 1000)
              .toISOString()
              .substring(0, 10) ===
            new Date(today).toISOString().substring(0, 10)
        ).length
    : 0;
  // 초기값 상품들
  const [preordered, setPreordered] = useState(
    products
      .filter(
        product =>
          new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
      )
      .filter(doc => doc.data.exposeToB2b === "노출")
      .sort((a, b) => {
        return (
          new Date(b.data.createdAt.seconds) -
          new Date(a.data.createdAt.seconds)
        );
      })
      .slice(0, 150)
  );
  const [common, setCommon] = useState(
    products
      .filter(
        product =>
          new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
      )
      .filter(doc => doc.data.exposeToB2b === "노출")
      .sort((a, b) => {
        return (
          new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
        );
      })
    // .slice(0, 500)
  );
  const [deal, setDeal] = useState(
    products
      .filter(
        product =>
          new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
      )
      .filter(doc => doc.data.exposeToB2b === "DEAL")
      .sort((a, b) => {
        return (
          new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
        );
      })
      .slice(0, 150)
  );

  // 초기화 버튼
  const handleClear = e => {
    e.preventDefault();
    // 프리오더
    setPreordered(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
        )
        .filter(doc => doc.data.exposeToB2b === "노출")
        .sort((a, b) => {
          return (
            new Date(a.data.preOrderDeadline.seconds) -
            new Date(b.data.preOrderDeadline.seconds)
          );
        })
        .slice(0, 150)
    );
    // 일반
    setCommon(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
        )
        .filter(doc => doc.data.exposeToB2b === "노출")
        .sort((a, b) => {
          return (
            new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
          );
        })
        .slice(0, 500)
    );
    // 특별가
    setDeal(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
        )
        .filter(doc => doc.data.exposeToB2b === "DEAL")
        .sort((a, b) => {
          return (
            new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
          );
        })
        .slice(0, 150)
    );
    setQuery("");
  };
  // 검색하기 버튼
  // 세 상품이 겹치면 안됨
  // 프리오더 상품
  const searchedProducts = e => {
    e.preventDefault();

    // 프리오더
    setPreordered(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) > today
        )
        .filter(doc => doc.data.exposeToB2b === "노출")
        .filter(doc =>
          query.split(" ").length === 1
            ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.barcode.toUpperCase().includes(query.toUpperCase())
            : query.split(" ").length === 2
            ? ((doc.data.title
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.title
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.sku
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.sku
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.barcode
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.barcode
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase())))
            : ""
        )
        .sort((a, b) => {
          return (
            new Date(a.data.preOrderDeadline.seconds) -
            new Date(b.data.preOrderDeadline.seconds)
          );
        })
    );
    // 일반
    setCommon(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
        )
        .filter(doc => doc.data.exposeToB2b === "노출")
        .filter(doc =>
          query.split(" ").length === 1
            ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.barcode.toUpperCase().includes(query.toUpperCase())
            : query.split(" ").length === 2
            ? ((doc.data.title
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.title
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.sku
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.sku
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.barcode
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.barcode
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase())))
            : ""
        )
        .sort((a, b) => {
          return (
            new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
          );
        })
    );
    // 특별가
    setDeal(
      products
        .filter(
          product =>
            new Date(product?.data?.preOrderDeadline?.seconds * 1000) <= today
        )
        .filter(doc => doc.data.exposeToB2b === "DEAL")
        .filter(doc =>
          query.split(" ").length === 1
            ? doc.data.title.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.title.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.sku.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.sku.toUpperCase().includes(query.toUpperCase()) ||
              doc.data.barcode.toLowerCase().includes(query.toLowerCase()) ||
              doc.data.barcode.toUpperCase().includes(query.toUpperCase())
            : query.split(" ").length === 2
            ? ((doc.data.title
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.title
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.title
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.title
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.sku
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.sku
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.sku
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.sku
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase()))) ||
              ((doc.data.barcode
                .toLowerCase()
                .includes(query.split(" ")[0].toLowerCase()) ||
                doc.data.barcode
                  .toUpperCase()
                  .includes(query.split(" ")[0].toUpperCase())) &&
                (doc.data.barcode
                  .toLowerCase()
                  .includes(query.split(" ")[1].toLowerCase()) ||
                  doc.data.barcode
                    .toUpperCase()
                    .includes(query.split(" ")[1].toUpperCase())))
            : ""
        )
        .sort((a, b) => {
          return (
            new Date(b.data.relDate.seconds) - new Date(a.data.relDate.seconds)
          );
        })
    );
  };
  // {title(id):quan} 형태로 가져오기
  const [confirmChecked, setConfirmCheck] = useState(false);
  const [form, onChange, reset, deleteList] = useSimpleList(
    {},
    setConfirmCheck,
    products
  );

  // list 별 메모 정의
  // const [memoInList, setMemoInList] = useState("")

  // list 만들기
  let simpleList = [];
  const handleCheck = () => {
    if (simpleList.length > 0) {
      setConfirmCheck(true);
    } else if (simpleList.length === 0) {
      setConfirmCheck(false);
    }
  };
  if (form && products) {
    let i = 0;
    for (let key in form) {
      if (form[key]) {
        simpleList.push({
          exchangeRate,
          orderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}`,
          currency: user.currency,
          nickName: user.nickName,
          productId: key,
          title: products.find(product => product.id === key).data.title,
          quan: Number(form[key]),
          price:
            Number(
              (
                (products.find(product => product.id === key).data.price /
                  exchangeRate[user?.currency]) *
                  (1 -
                    user.dcRates[
                      products.find(product => product.id === key).data.category
                    ]) -
                user.dcAmount[
                  `${
                    products.find(product => product.id === key).data.category
                  }A`
                ]
              ).toFixed(2)
            ) || 0,
          totalPrice:
            Number(
              (products.find(product => product.id === key).data.price /
                exchangeRate[user?.currency]) *
                (1 -
                  user.dcRates[
                    products.find(product => product.id === key).data.category
                  ]) -
                user.dcAmount[
                  `${
                    products.find(product => product.id === key).data.category
                  }A`
                ]
            ).toFixed(2) * Number(form[key]) || 0,
          weight:
            Number(products.find(product => product.id === key).data.weight) ||
            0,
          totalWeight:
            Number(products.find(product => product.id === key).data.weight) *
              Number(form[key]) || 0,
          dcRate:
            Number(
              state.user.dcRates[
                products.find(product => product.id === key).data.category
              ]
            ) || 0,
          dcAmount:
            Number(
              state.user.dcAmount[
                products.find(product => product.id === key).data.category
              ]
            ) || 0,
          relDate:
            products.find(product => product.id === key).data.relDate || 0,
          preOrderDeadline:
            products.find(product => product.id === key).data
              .preOrderDeadline || 0,
          childOrderNumber: `${user.alias}-${new Date(today)
            .toISOString()
            .substring(2, 10)
            .replaceAll("-", "")}-${addZeros(forOrderNumber, 3)}-${i + 1}`,
          moved: false,
          moveTo: "",
          canceled: false,
          shipped: false,
          createdAt: new Date(),
          barcode:
            products.find(product => product.id === key).data.barcode || "",
          sku: products.find(product => product.id === key).data.sku || "",
          // memoInList
        });
        i++;
      }
    }
  }

  // b2b make order
  const B2bMakeOrder = async () => {
    // dispatch로 심플리스트 스테이트로 업데이트하고
    await dispatch({ type: "SIMPLELIST", simpleList });
    reset();
    history.push(`/b2border`);
  };

  // b2b make special order
  const B2bMakeSpecialOrder = async () => {
    // dispatch로 심플리스트 스테이트로 업데이트하고
    history.push(`/b2bspecialorder`);
  };

  // common 이랑 preorder 에 재고 재입고 요청하기
  const reStockRequest = (product, user, qty) => {
    db.collection("reStockRequests").doc().set({
      requestDate: new Date(),
      barcode: product.data.barcode,
      sku: product.data.sku,
      title: product.data.title,
      customer: user?.email,
      qty: qty,
      confirmed: false,
    });
    alert("Requested");
  };

  // message
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const refresh = async () => {
    await db
      .collection("rooms")
      .doc(selectedRoom?.id)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot =>
        setSelectedMessages({
          messages: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          })),
        })
      );
  };

  useEffect(() => {
    handleCheck();
  }, [simpleList]);

  useEffect(() => {
    setSelectedRoom(
      user?.email ? rooms?.find(room => room.data.userName === user?.email) : []
    );
  }, [user, rooms]);

  useEffect(() => {
    refresh();
  }, [selectedRoom, selectedRoom?.id]);

  return (
    <div className="w-full h-auto flex ">
      {/* d2 -1 */}
      <div
        className=" w-3/5 h-auto flex flex-col 
      items-center mt-12"
      >
        <form
          onSubmit={searchedProducts}
          className="top-2 left-40 absolute z-50 flex flex-row
        "
        >
          <div className="bg-gray-200 p-1 rounded-lg w-96 flex flex-row">
            <input
              type="text"
              className=" rounded-md outline-none pl-3 w-80"
              placeholder="search"
              onChange={queryOnChange}
              value={query}
            />{" "}
            <div className="flex flex-row justify-evenly w-1/4">
              <SearchIcon
                className="cursor-pointer"
                type="submit"
                onClick={searchedProducts}
              />
              <RestoreIcon onClick={handleClear} className="cursor-pointer" />
            </div>
          </div>
          <div className="pr-5 flex flex-row items-center pl-5">
            <div
              onClick={() => history.push("/myorderlist")}
              className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 mr-5 cursor-pointer"
            >
              MyOrders
            </div>
            <div
              onClick={() => history.push(`/myinfo/${user.uid}`)}
              className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 mr-5 cursor-pointer"
            >
              MyInfo
            </div>
            {user?.type === "customer" && (
              <>
                <div
                  onClick={openModal}
                  className="text-sm font-mono font-bold text-center 
                          text-gray-200 bg-blue-900 mr-5 cursor-pointer"
                >
                  Message
                </div>
                <Modal open={modalOpen} close={closeModal} header={"Message"}>
                  <InSimpleList
                    user={user}
                    selectedMessages={selectedMessages}
                    selectedRoom={selectedRoom}
                    refresh={refresh}
                  />
                </Modal>
              </>
            )}

            <div
              // onClick={openModal}
              onClick={B2bMakeSpecialOrder}
              className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 mr-5 cursor-pointer"
            >
              Special-Order
            </div>
            {/* <Modal open={modalOpen} close={closeModal} header={"Special Order"}>
              <SpecialOrder />
            </Modal> */}
          </div>
        </form>
        {preordered && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              PRE ORDER
            </div>
            <PreOrderTable
              preorderProducts={preordered}
              exchangeRate={exchangeRate}
              onChange={onChange}
              user={user}
              reStockRequest={reStockRequest}
              simpleList={simpleList}
            />
          </>
        )}

        {common && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              PRODUCTS{" "}
            </div>
            <Common
              commonProducts={common}
              dispatch={dispatch}
              category={state.category}
              onChange={onChange}
              simpleList={simpleList}
              user={user}
              exchangeRate={exchangeRate}
              reStockRequest={reStockRequest}
            />
          </>
        )}
        {deal && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              HOT DEAL{" "}
            </div>
            <DealTable
              dealProducts={deal}
              exchangeRate={exchangeRate}
              onChange={onChange}
              user={user}
            />
          </>
        )}
      </div>
      {/* d2-2 */}
      <div className=" w-2/5 flex flex-col items-center mt-12 mr-5">
        {notices && <NoticeTable notices={notices} />}
        {deal && (
          <>
            <div className="text-center text-sm font-bold text-gray-800">
              SCHEDULE
            </div>
          </>
        )}
        <SimpleList
          exchangeRate={exchangeRate}
          confirmChecked={confirmChecked}
          simpleList={simpleList && simpleList}
          dispatch={dispatch}
          B2bMakeOrder={B2bMakeOrder}
          state={state}
          onChange={onChange}
          deleteList={deleteList}
        />
      </div>
    </div>
  );
};

export default B2bShop;
