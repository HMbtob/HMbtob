import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import axios from "axios";
import { InitDataContext, InitDispatchContext } from "../../../App";
import AddBigc from "./AddBigc";

const AddProduct = () => {
  const history = useHistory();
  const state = useContext(InitDataContext);
  const { allOrderProductsList, user } = state;
  const [cats, setCats] = useState([]);
  const [parentCat, setParentCat] = useState([]);
  const [childCat, setChildCat] = useState([]);
  const [lastId, setLastId] = useState("");
  const [bigC, setBigC] = useState("");
  // 체크박스
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  const [form, onChange, reset] = useInputs({
    sku: "",
    title: "",
    purchasePrice: 0,
    price: 0,
    artist: "",
    ent: "",
    thumbNail: "",
    descrip: "",
    weight: 0,
    x: 0,
    y: 0,
    z: 0,
    category: "",
    relDate: new Date(),
    preOrderDeadline: new Date(),
    pob: false,
    poster: false,
    photocard: false,
    weverseGift: false,
    interAsiaPhotocard: false,
    barcode: "",
    reStockable: "",
    exposeToB2b: "",
    stock: 0,
    inventoryLevel: 0,
    brandId: "",
    brandName: "",
    customFieldName: "RELEASE DATE",
  });

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { price: "도매가" },
    { purchasePrice: "매입가" },
    { artist: "그룹명" },
    { ent: "소속사" },
    { thumbNail: "썸네일" },
    { descrip: "상세페이지" },
    { weight: "무게" },
    { x: "가로" },
    { y: "세로" },
    { z: "높이" },
    { barcode: "바코드" },
    { stock: "재고" },
  ];

  // 셀렉트인풋
  const selects = [
    {
      category: [
        { cd: "cd" },
        { "dvd/blue-ray": "dvdBlueRay" },
        { "photo book": "photoBook" },
        { goods: "goods" },
        { "store goods": "officialStore" },
        { beauty: "beauty" },
      ],
    },
  ];

  const selectsName = ["카테고리"];

  // 체크박스 인풋
  const checkboxInput = [
    { poster: "Poster" },
    { pob: "POB" },
    { photocard: "Photocard" },
    { weverseGift: "Weverse Gift" },
    { interAsiaPhotocard: " InterAsia Photocard" },
  ];

  const {
    sku,
    title,
    purchasePrice,
    artist,
    ent,
    category,
    thumbNail,
    descrip,
    weight,
    x,
    y,
    z,
    relDate,
    preOrderDeadline,
    poster,
    pob,
    photocard,
    weverseGift,
    interAsiaPhotocard,
    barcode,
    reStockable,
    stock,
    exposeToB2b,
    price,
    // 이하 빅커머스용 변수
    inventoryLevel,
    brandId,
    brandName,
    customFieldName,
  } = form;

  const callCats = async () => {
    await axios
      .get(`/stores/7uw7zc08qw/v3/catalog/categories`, {
        headers: {
          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
          accept: "application/json",
          "content-type": "application/json",
        },
      })
      .then(cats => setCats(cats.data.data))
      .catch(error => console.log(error));
  };

  const callLastId = async () => {
    await axios
      .get(`/stores/7uw7zc08qw/v3/catalog/products`, {
        params: { sort: "id", direction: "desc", limit: 1 },
        headers: {
          "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
          accept: "application/json",
          "content-type": "application/json",
        },
      })
      .then(ids => setLastId(ids.data.data))
      .catch(error => console.log(error));
  };
  const Appp = async e => {
    e.preventDefault();
    // 빅커머스 가장 최근 아이디 가져와서
    //  + 1 해서 id 로 저장
    if (lastId) {
      const headers = {
        "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
        accept: "application/json",
        "content-type": "application/json",
      };

      await axios
        .post(
          `/stores/7uw7zc08qw/v3/catalog/products`,
          {
            name: title,
            price: Number(price),
            weight: Number(weight),
            type: "physical",
            custom_fields: [{ name: customFieldName, value: relDate }],
            sku: sku,
            upc: barcode,
            inventory_tracking: "product",
            inventory_level: inventoryLevel,
            brand_name: brandName,
            categories: checkedInputs,
          },
          { headers }
        )
        .then()
        .catch(error => console.log(error));

      await axios
        .get(`/stores/7uw7zc08qw/v3/catalog/products/${lastId[0]?.id + 1}`, {
          headers: {
            "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
            accept: "application/json",
            "content-type": "application/json",
          },
        })
        .then(pro => setBigC(pro.data.data))
        .catch(error => console.log(error));

      await db
        .collection("products")
        .doc(`${lastId[0]?.id + 1}`)
        .set({
          sku,
          purchasePrice: Number(purchasePrice),
          price: Number(price),
          artist,
          ent,
          x: Number(x),
          stock: stock,
          y: Number(y),
          z: Number(z),
          title,
          thumbNail,
          descrip,
          weight: Number(weight),
          category,
          relDate: new Date(relDate),
          preOrderDeadline: new Date(preOrderDeadline),
          options: {
            poster,
            pob,
            photocard,
            weverseGift,
            interAsiaPhotocard,
          },
          barcode,
          reStockable: reStockable,
          exposeToB2b: exposeToB2b,
          bigC: bigC,
          productMemo: [
            {
              memo: "add product",
              date: new Date(),
              writer: "server",
            },
          ],
          limitedStock: false,
          totalStock: stock,
          totalSold: 0,
          stockHistory: [
            {
              type: "add product on list",
              writer: user.email,
              amount: 0,
              date: new Date(),
            },
          ],
        });
      // 파이어 베이스 저장 후
      // 빅커머스 상품등록
      // 디폴트
      // type : physical
      // inventory_tracking : product

      await reset();
      await alert("추가완료");
      // history.push("/listproduct");
    } else {
      alert("실패");
    }
  };

  useEffect(() => {
    callCats();
    callLastId();
  }, []);
  useEffect(() => {
    setParentCat(
      cats
        .filter(cat => cat.parent_id === 0)
        .sort((a, b) => {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        })
    );
    setChildCat(
      cats
        .filter(cat => cat.parent_id !== 0)
        .sort((a, b) => {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        })
    );
  }, [cats]);

  return (
    <>
      <form className="w-3/5 m-auto my-20" onSubmit={Appp}>
        <div
          className="text-left text-2xl  
        text-gray-800 mb-1 ml-2 "
        >
          상품 추가
        </div>

        <div className="bg-white p-10 border">
          {Inputs.map((doc, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right mr-3">
                {Object.values(doc)}
              </div>
              <input
                required
                className="col-span-3 border h-9 pl-2"
                type="text"
                onChange={onChange}
                name={Object.keys(doc)}
                value={form[Object.keys(doc)]}
              />
            </div>
          ))}
          {/* 날짜 인풋 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">출시일</div>
            <input
              required
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              value={relDate}
              name="relDate"
            />
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">주문마감일</div>
            <input
              required
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              value={preOrderDeadline}
              name="preOrderDeadline"
            />
          </div>
          {/* 드랍박스 인풋 */}
          {/* 카테고리 */}
          {selects.map((select, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right  mr-3">
                {selectsName[index]}
              </div>
              <select
                required
                key={index}
                name={Object.keys(select)}
                onChange={onChange}
                className="col-span-3 border h-9 pl-3"
              >
                <option value="" defaultValue>
                  필수선택
                </option>
                {Object.values(select)[0].map((option, index) => (
                  <option key={index} value={Object.values(option)}>
                    {Object.keys(option)}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {/* restockable, 활성/비활성 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">재고추가가능</div>
            <select
              required
              name="reStockable"
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
            >
              <option value="" defaultValue>
                필수선택
              </option>
              <option value={true}>가능</option>
              <option value={false}>불가능</option>
            </select>
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">B2B 활성화</div>
            <select
              required
              name="exposeToB2b"
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
            >
              <option value="" defaultValue>
                필수선택
              </option>
              <option value="노출">노출</option>
              <option value="숨김">숨김</option>
              <option value="DEAL">DEAL</option>
            </select>
          </div>
          {/* 체크박스 인풋 */}
          <div className="mt-10 mb-3 text-gray-800 text-lg">OPTIONS</div>
          <div className="grid grid-cols-3">
            {checkboxInput.map((doc, index) => (
              <div key={index} className="grid grid-cols-2 p-2 items-center">
                <div key={index} className="text-gray-600 text-right mr-3">
                  {Object.values(checkboxInput[index])}
                </div>
                <input
                  className=""
                  type="checkbox"
                  onChange={onChange}
                  name={Object.keys(doc)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-600 py-2 px-10 rounded 
            text-gray-200 text-lg font-light
             "
            >
              SAVE
            </button>
          </div>
        </div>
        {/* 빅커머스 */}
        <AddBigc
          sku={sku}
          title={title}
          price={price}
          weight={weight}
          relDate={relDate}
          barcode={barcode}
          inventoryLevel={inventoryLevel}
          brandId={brandId}
          brandName={brandName}
          customFieldName={customFieldName}
          parentCat={parentCat}
          childCat={childCat}
          checkedInputs={checkedInputs}
          changeHandler={changeHandler}
          onChange={onChange}
        />
      </form>
    </>
  );
};

export default AddProduct;
