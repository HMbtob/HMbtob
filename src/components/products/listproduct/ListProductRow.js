import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import Modal from "../../modal/Modal";
import HiddenB2b from "./HiddenB2b";
import HiddenBigc from "./HiddenBigc";
import StockTable from "./StockTable";
import ProductMemo from "./ProductMemo";
import StoreProduct from "./StoreProduct";
import BuildIcon from "@material-ui/icons/Build";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import CommentIcon from "@material-ui/icons/Comment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SyncIcon from "@material-ui/icons/Sync";
import SyncDisabledIcon from "@material-ui/icons/SyncDisabled";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import axios from "axios";
import { InitDataContext } from "../../../App";

const ListProductRow = ({
  id,
  sku,
  thumbNail,
  title,
  price,
  stock,
  totalStock,
  totalSell,
  unShipped,
  relDate,
  preOrderDeadline,
  orders,
  shippings,
  barcode,
  bigcProductId,
  user,
  exchangeRate,
  weight,
  hiddenAll,
  orderListInShippings,
}) => {
  const state = useContext(InitDataContext);
  const { products } = state;
  const product = products.find((product) => product.id === id);
  const history = useHistory();
  const today = new Date();

  const [forHidden, setForHidden] = useState(true);

  const handleHidden = (forHidden) => {
    if (forHidden === true) {
      setForHidden(false);
    } else if (forHidden === false) {
      setForHidden(true);
    }
  };
  // 재고수불부 모달
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    if (forHidden) {
      handleHidden(forHidden);
    }
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  // 재고수불부에서 빅커머스 total_sold 가져가려고 만든 state
  const [bigTotalSold, setBigTotalSold] = useState(null);
  const handleBigTotalSold = (q) => {
    setBigTotalSold(q);
  };
  //상품별 메모 모달
  const [modalOpen2, setModalOpen2] = useState(false);

  const openModal2 = () => {
    setModalOpen2(true);
  };
  const closeModal2 = () => {
    setModalOpen2(false);
  };

  const [form, onChange] = useInputs({
    barcode2: barcode,
    sku2: sku,
    weight2: weight,
    title2: title,
  });

  const { barcode2, sku2, weight2, title2 } = form;

  // 가격이랑 출시일은 따로
  const [price2, setPrice2] = useState(
    exchangeRate[user?.currency] === 1
      ? price / exchangeRate[user?.currency]
      : price / exchangeRate[user?.currency]
  );

  const handlePrice2 = (e) => {
    setPrice2(
      exchangeRate[user?.currency] === 1
        ? e.target.value / exchangeRate[user?.currency]
        : e.target.value / exchangeRate[user?.currency]
    );
  };

  const [relDate2, setRelDate2] = useState(
    new Date(product?.data?.relDate?.seconds * 1000)
      ?.toISOString()
      ?.substring(0, 10)
  );

  const handleRelDate2 = (e) => {
    setRelDate2(e.target.value);

    db.collection("products")
      .doc(id)
      .update({ relDate: new Date(e.target.value) });
  };

  const [category, setCategory] = useState(product.data.category);
  const handleCat = (e) => {
    setCategory(e.target.value);
    db.collection("products").doc(id).update({ category: e.target.value });
  };

  const handleDelete = () => {
    let con = window.confirm("정말로 삭제하시겠습니까?");
    if (con === true) {
      db.collection("products").doc(id).delete();
    } else if (con === false) {
      return;
    }
  };

  // 해당상품 포함한 주문 검색
  // const [includedProducts, setIncludedProducts] = useState([]);
  const includedProduct = () => {
    // await setIncludedProducts(() =>
    //   orders.filter(order => order.data.list.some(li => li.productId === id))
    // );
    if (
      orders.filter((order) =>
        order.data.list.some((li) => li.productId === id)
      ).length > 0
    ) {
      history.push({
        pathname: `/orderlist`,
        state: {
          includedProducts: orders.filter((order) =>
            order.data.list.some((li) => li.productId === id)
          ),
        },
      });
    } else if (
      orders.filter((order) =>
        order.data.list.some((li) => li.productId === id)
      ).length === 0
    ) {
      alert("주문이 없습니다.");
    }
  };

  const [options, setOptions] = useState(null);

  useEffect(() => {
    product.data.optioned &&
      db
        .collection("products")
        .doc(id)
        .collection("options")
        .orderBy("optionName", "asc")
        .get()
        .then((snapshot) =>
          setOptions(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          )
        );
  }, [product, id]);

  useEffect(() => {
    setPrice2(
      exchangeRate[user?.currency] === 1
        ? price / exchangeRate[user?.currency]
        : (price / exchangeRate[user?.currency]).toFixed(2)
    );
  }, [price, user, exchangeRate, products]);

  const [bcOptions, setBcOptions] = useState(null);

  useEffect(() => {
    product.data.optioned === true &&
      axios
        .get(
          `https://us-central1-interasiastock.cloudfunctions.net/app/big/productoptions/${bigcProductId}`
        )
        .then((data) => setBcOptions(data.data))
        .catch((e) => console.log(e));
  }, [bigcProductId, product]);

  return (
    <div
      className={`border-b  border-gray-500 w-full py-1 ${
        relDate.toDate() > today ? "bg-red-100 " : "bg-white "
      }`}
    >
      <div
        className={`grid grid-cols-36 items-center place-items-center 
        text-xs  w-full`}
      >
        <div className="col-span-4 flex flex-row justify-evenly w-full items-center">
          <DeleteOutlineIcon
            className="cursor-pointer"
            fontSize="small"
            style={{ color: "gray" }}
            onClick={handleDelete}
          />
          {/* 메모 아이콘 */}
          <CommentIcon
            className="cursor-pointer"
            onClick={openModal2}
            fontSize="small"
            style={{ color: "gray" }}
          />
          <Modal open={modalOpen2} close={closeModal2} header={"상품 메모"}>
            <ProductMemo
              productMemo={product.data.productMemo}
              id={id}
              user={user}
            />
          </Modal>
          {/* 디테일수정 아이콘 */}
          <button onClick={() => history.push(`/detailproduct/${id}`)}>
            <BuildIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          <button
            onClick={() =>
              history.push({
                pathname: `/addproduct`,
                state: { product },
              })
            }
          >
            <FileCopyIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          {/* 재고수불부 아이콘 */}
          <button onClick={openModal}>
            <SyncAltIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          <Modal open={modalOpen} close={closeModal} header={"재고수불부"}>
            <StockTable
              product={product}
              stockHistory={product.data.stockHistory}
              bigTotalSold={bigTotalSold}
              totalStock={totalStock}
              id={id}
            />
          </Modal>
          <button onClick={includedProduct} className="cursor-pointer">
            <ManageSearchIcon fontSize="small" style={{ color: "gray" }} />
          </button>
          <button
            onClick={() => handleHidden(forHidden)}
            className="cursor-pointer"
          >
            <AddCircleOutlineIcon fontSize="small" style={{ color: "gray" }} />
          </button>
        </div>

        <div className="col-span-3">
          <input
            type="text"
            value={barcode2}
            onChange={onChange}
            name="barcode2"
            className="p-1 outline-none bg-transparent"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                db.collection("products").doc(id).update({ barcode: barcode2 });
                return false;
              }
            }}
          />
        </div>
        <div className="col-span-3">
          <input
            type="text"
            value={sku2}
            onChange={onChange}
            name="sku2"
            className="p-1 outline-none bg-transparent"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                db.collection("products").doc(id).update({ sku: sku2 });
                return false;
              }
            }}
          />
        </div>
        <img className="col-span-2 h-8 rounded-sm " src={thumbNail} alt="" />
        <div
          className="col-span-9 text-left 
          w-full flex flex-col items-start"
        >
          <div className=" bg-transparent text-gray-600 text-xs w-auto items-center flex">
            {/* 노출/숨김 버튼 */}
            {product.data.exposeToB2b === "숨김" && (
              <VisibilityOffIcon
                className="cursor-pointer"
                style={{ color: "red", fontSize: "18", opacity: "0.7" }}
                onClick={() =>
                  db
                    .collection("products")
                    .doc(id)
                    .update({ exposeToB2b: "노출" })
                }
              />
            )}
            {product.data.exposeToB2b === "노출" && (
              <VisibilityIcon
                className="cursor-pointer"
                style={{ color: "blue", fontSize: "16", opacity: "0.7" }}
                onClick={() =>
                  db
                    .collection("products")
                    .doc(id)
                    .update({ exposeToB2b: "숨김" })
                }
              />
            )}
            <select
              name="category"
              value={category}
              onChange={handleCat}
              className="bg-transparent outline-none ml-3"
            >
              <option value="cd">
                cd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
              <option value="dvdBlueRay">
                dvdBlueRay&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
              <option value="photoBook">
                photoBook&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
              <option value="goods">
                goods&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
              <option value="officialStore">
                officialStore&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
              <option value="beauty">
                beauty&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </option>
            </select>
          </div>
          <input
            type="text"
            value={title2}
            onChange={onChange}
            name="title2"
            className="p-1 outline-none bg-transparent w-full"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                db.collection("products").doc(id).update({ title: title2 });
                return false;
              }
            }}
          />
        </div>
        <div className="col-span-3 flex flex-row items-center">
          <div>{user?.currency}</div>
          <input
            type="number"
            value={price2}
            onChange={handlePrice2}
            name="price2"
            className="p-1 outline-none bg-transparent w-full text-center"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                db.collection("products").doc(id).update({ price: price2 });
                return false;
              }
            }}
          />
        </div>
        <div className="col-span-2 flex flex-row items-center">
          <StoreProduct
            stockHistory={product.data.stockHistory}
            bigTotalSold={bigTotalSold}
            totalStock={totalStock}
            product={product}
            user={user}
            products={products}
          />
          <div>
            {/* 무한재고 */}
            {product.data.limitedStock === false ? (
              <SyncIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "blue", opacity: "0.7", fontSize: "15" }}
                onClick={async (e) => {
                  e.preventDefault();
                  await db
                    .collection("products")
                    .doc(id)
                    .update({ limitedStock: true });
                  return false;
                }}
              />
            ) : product.data.limitedStock === true ? (
              <SyncDisabledIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "red", opacity: "0.7", fontSize: "15" }}
                onClick={async (e) => {
                  e.preventDefault();
                  await db
                    .collection("products")
                    .doc(id)
                    .update({ limitedStock: false });
                  return false;
                }}
              />
            ) : (
              ""
            )}
            {/* 재입고 가능 */}
            {product.data.reStockable === "불가능" ? (
              <LockIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "red", opacity: "0.7", fontSize: "15" }}
                onClick={async (e) => {
                  e.preventDefault();
                  await db
                    .collection("products")
                    .doc(id)
                    .update({ reStockable: "가능" });
                }}
              />
            ) : product.data.reStockable === "가능" ? (
              <LockOpenIcon
                className="cursor-pointer"
                fontSize="small"
                style={{ color: "blue", opacity: "0.7", fontSize: "15" }}
                onClick={async (e) => {
                  e.preventDefault();
                  await db
                    .collection("products")
                    .doc(id)
                    .update({ reStockable: "불가능" });
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-span-2">
          {bigTotalSold || bigTotalSold === 0 ? totalStock - bigTotalSold : ""}
        </div>
        <div className="col-span-1">
          {totalSell ? totalSell.toLocaleString("ko-KR") : ""}
        </div>
        <div className="col-span-1">
          {unShipped ? unShipped.toLocaleString("ko-KR") : ""}
        </div>
        <div className="col-span-2 justify-center flex">
          {" "}
          <input
            type="text"
            value={weight2}
            onChange={onChange}
            name="weight2"
            className="p-1 outline-none w-3/4 text-center bg-transparent"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                db.collection("products").doc(id).update({ weight: weight2 });
                return false;
              }
            }}
          />{" "}
        </div>
        <div className="col-span-4 text-xs">
          {relDate && (
            <input
              type="date"
              value={relDate2}
              onChange={handleRelDate2}
              name="relDate2"
              className="p-1 outline-none bg-transparent w-full"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  db.collection("products")
                    .doc(id)
                    .update({ relDate: relDate2 });
                  return false;
                }
              }}
            />
          )}
        </div>
      </div>
      {forHidden && hiddenAll ? (
        ""
      ) : (
        <>
          {options ? (
            options.map((op) => (
              <HiddenB2b
                id={id}
                // sku={sku}
                price={price}
                stock={stock}
                relDate={relDate}
                // orders={orders}
                // shippings={shippings}
                product={product}
                currency={user.currency}
                orderListInShippings={orderListInShippings}
                op={op}
              />
            ))
          ) : (
            <HiddenB2b
              id={id}
              // sku={sku}
              price={price}
              stock={stock}
              relDate={relDate}
              // orders={orders}
              // shippings={shippings}
              product={product}
              currency={user.currency}
              orderListInShippings={orderListInShippings}
            />
          )}
          <div className="border-t-4"></div>
          {bcOptions ? (
            bcOptions.map((option) => (
              <HiddenBigc
                // id={id}
                sku={sku}
                thumbNail={thumbNail}
                title={title}
                price={price}
                stock={stock}
                totalSell={totalSell}
                unShipped={unShipped}
                relDate={relDate}
                preOrderDeadline={preOrderDeadline}
                orders={orders}
                shippings={shippings}
                bigcProductId={bigcProductId}
                handleBigTotalSold={handleBigTotalSold}
                // bigTotalSold={bigTotalSold}
                // totalStock={totalStock}
                optioned={product.data.optioned === true ? true : false}
                option={option}
              />
            ))
          ) : (
            <HiddenBigc
              // id={id}
              sku={sku}
              thumbNail={thumbNail}
              title={title}
              price={price}
              stock={stock}
              totalSell={totalSell}
              unShipped={unShipped}
              relDate={relDate}
              preOrderDeadline={preOrderDeadline}
              orders={orders}
              shippings={shippings}
              // totalStock={totalStock}
              bigcProductId={bigcProductId}
              handleBigTotalSold={handleBigTotalSold}
              // bigTotalSold={bigTotalSold}
              optioned={product.data.optioned === true ? true : false}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ListProductRow;
