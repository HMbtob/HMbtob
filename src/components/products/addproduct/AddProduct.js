import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { InitDataContext } from "../../../App";
import { db } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
// import AddBigc from "./AddBigc";
// import { useCallback } from "react";
import { OptionSet } from "./OptionSet";
import uuid from "react-uuid";

const AddProduct = ({ location }) => {
  console.log(location?.state?.product);

  const history = useHistory();

  const state = useContext(InitDataContext);
  const { user } = state;
  // const [cats, setCats] = useState([]);
  // const [parentCat, setParentCat] = useState([]);
  // const [childCat, setChildCat] = useState([]);

  // const [toggleBcSaveButton, setToggleBcSaveButton] = useState(false);

  // 옵션
  const [optionSet, setOptionSet] = useState([]);
  const [optionId, setOptionId] = useState("no");
  const [optionName, setOptionName] = useState(null);

  useEffect(() => {
    db.collection("optionSet")
      .doc(optionId)
      .onSnapshot((snapshot) => setOptionName(snapshot.data()));
  }, [optionId]);
  // 썸넬

  const [thumbnailUrl, setThumbnailUrl] = useState(
    location?.state?.product?.data?.thumbNail || ""
  );
  const handleThumbnail = (e) => {
    setThumbnailUrl(e.target.value);
  };
  // 디스크립션-이미지

  const [discripUrl, setDiscripUrl] = useState(
    location?.state?.product?.data?.discripUrl || ""
  );
  const handleDiscrip = (e) => {
    setDiscripUrl(e.target.value);
  };
  // 디스크립션 텍스트
  // const [descr, setDescr] = useState("");

  // 체크박스
  // const [checkedInputs, setCheckedInputs] = useState([]);

  // const changeHandler = (checked, id) => {
  //   if (checked) {
  //     setCheckedInputs([...checkedInputs, id]);
  //   } else {
  //     // 체크 해제
  //     setCheckedInputs(checkedInputs.filter((el) => el !== id));
  //   }
  // };

  const [form, onChange, reset] = useInputs({
    sku: location?.state?.product?.data?.sku || "",
    title: location?.state?.product?.data?.title || "",
    purchasePrice: location?.state?.product?.data?.purchasePrice || 0,
    price: location?.state?.product?.data?.price || 0,
    artist: location?.state?.product?.data?.artist || "",
    ent: location?.state?.product?.data?.ent || "",
    weight: location?.state?.product?.data?.weight || "",
    x: location?.state?.product?.data?.x || 0,
    y: location?.state?.product?.data?.y || 0,
    z: location?.state?.product?.data?.z || 0,
    category: location?.state?.product?.data?.category || "",
    relDate:
      location?.state?.product?.data?.title.length > 0
        ? new Date(location?.state?.product?.data?.relDate?.seconds * 1000)
            .toISOString()
            .substring(0, 10)
        : new Date().toISOString().substring(0, 10),
    preOrderDeadline:
      location?.state?.product?.data?.title.length > 0
        ? new Date(
            location?.state?.product?.data?.preOrderDeadline?.seconds * 1000
          )
            ?.toISOString()
            ?.substring(0, 16)
        : new Date().toISOString().substring(0, 16),
    pob: false,
    poster: false,
    photocard: false,
    weverseGift: false,
    interAsiaPhotocard: false,
    barcode: location?.state?.product?.data?.barcode || "default",
    reStockable: location?.state?.product?.data?.reStockable || "",
    exposeToB2b: location?.state?.product?.data?.exposeToB2b || "",
    stock: location?.state?.product?.data?.stock || 0,
    inventoryLevel: location?.state?.product?.data?.inventoryLevel || 0,
    brandId: location?.state?.product?.data?.bigC?.brand_id || "",
    brandName: location?.state?.product?.data?.artist || "",
    customFieldName: "RELEASE DATE",
  });

  // 텍스트 숫자인풋
  const Inputs = [
    { sku: "sku" },
    { title: "제목" },
    { price: "도매가" },
    // { purchasePrice: "매입가" },
    { artist: "그룹명" },
    { ent: "소속사" },
    { weight: "무게(g)" },
    { x: "가로" },
    { y: "세로" },
    { z: "높이" },
    { barcode: "바코드" },
    { stock: "재고" },
  ];

  // // 셀렉트인풋
  // const selects = [
  //   {
  //     category: [
  //       { cd: "cd" },
  //       { "dvd/blue-ray": "dvdBlueRay" },
  //       { "photo book": "photoBook" },
  //       { goods: "goods" },
  //       { "store goods": "officialStore" },
  //       { beauty: "beauty" },
  //     ],
  //   },
  // ];

  // const selectsName = ["카테고리"];

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
    artist,
    ent,
    // category,
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
    // inventoryLevel,
    // brandId,
    // brandName,
    // customFieldName,
  } = form;
  // const callCats = useCallback(async () => {
  //   await axios
  //     .get(
  //       `https://us-central1-interasiastock.cloudfunctions.net/app/big/getcategory`
  //     )
  // .then((cats) => setCats(cats.data.data))
  //     .catch((error) => console.log(error));
  // }, []);

  // 섬넬
  const getImages = async () => {
    if (title.length < 1) {
      alert("TITLE 을 입력해주세요.");
      return;
    }
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/getThumbnail`,
        {
          params: {
            url: thumbnailUrl,
            title: title,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setThumbnailUrl(res.data);
      })
      .catch((e) => console.log(e));
  };
  // 디스크립션
  const getDisc = async () => {
    if (title.length < 1) {
      alert("TITLE 을 입력해주세요.");
      return;
    }
    await axios
      .get(
        `https://us-central1-interasiastock.cloudfunctions.net/app/big/getdesc`,
        {
          params: {
            url: discripUrl,
            title: title,
          },
        }
      )
      .then((res) => setDiscripUrl(res.data))
      .catch((e) => console.log(e));
  };

  const Appp = async () => {
    const prodId = uuid();
    try {
      await db
        .collection("products")
        .doc(prodId)
        .set({
          sku,
          purchasePrice: Number(
            category === "cd"
              ? price * 0.83
              : category === "officialStore" || category === "beauty"
              ? price
              : price * 0.93
          ),
          price: Number(price),
          createdAt: new Date(),
          artist,
          ent,
          x: Number(x),
          stock: Number(stock),
          y: Number(y),
          z: Number(z),
          title: title.trim(),
          thumbNail: thumbnailUrl,
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
          // bigC: { id },
          productMemo: [
            {
              memo: "add product",
              date: new Date(),
              writer: "server",
            },
          ],
          limitedStock: false,
          totalStock: Number(stock),
          totalSold: 0,
          stockHistory: [
            {
              type: "add product on list",
              writer: user.nickName || user.email,
              amount: 0,
              date: new Date(),
            },
          ],
          // descr,
          discripUrl,
          addedBy: user?.nickName || user.email,
          addedByOther: user.type !== "admin" ? true : false,
          optioned: optionSet.length > 0 ? true : false,
        });
      optionSet.map(
        async (option, i) =>
          await db
            .collection("products")
            .doc(prodId)
            .collection("options")
            .doc()
            .set({
              no: i,
              optionName: option.optionName,
              optionPrice: Number(option.optionPrice),
              optionStock: Number(option.optionStock),
            })
      );

      await reset();
      alert("추가완료");
      history.push("/listproduct");
    } catch (e) {
      // setToggleBcSaveButton(false);
      console.log("get added product err", e);
    }
  };

  // const addBig = async () => {
  //   setToggleBcSaveButton(true);
  //   const data = {
  //     name: title,
  //     price: Number(
  //       category === "cd"
  //         ? (price / 1100).toFixed(2)
  //         : category === "officialStore"
  //         ? (price / 0.8 / 1100).toFixed(2)
  //         : (price / 0.9 / 1100).toFixed(2)
  //     ),
  //     weight: Number(weight / 1000),
  //     type: "physical",
  //     custom_fields_name: customFieldName,
  //     custom_fields_Value: relDate,
  //     is_thumbnail: true,
  //     image_url: thumbnailUrl,
  //     sku: sku,
  //     upc: barcode,
  //     inventory_tracking: optionSet.length > 0 ? "variant" : "product",
  //     inventory_level: Number(inventoryLevel),
  //     brand_name: brandName,
  //     categories: checkedInputs,
  //     description: `${descr} <img src=${discripUrl} alt="" />`,
  //     variants: optionSet.map((option) => ({
  //       price: Number(
  //         category === "cd"
  //           ? (option.optionPrice / 1100).toFixed(2)
  //           : category === "officialStore"
  //           ? (option.optionPrice / 0.8 / 1100).toFixed(2)
  //           : (option.optionPrice / 0.9 / 1100).toFixed(2)
  //       ),

  //       inventory_level: option.optionStock,
  //       sku: `${optionName.optionSetName}-${option.optionName}-${sku}`,
  //       option_values: [
  //         {
  //           option_display_name: optionName.optionSetName,
  //           label: option.optionName,
  //         },
  //       ],
  //     })),
  //     // variants: [
  //     //   {
  //     //     price: 11,
  //     //     sku: "SKU-BLU1",
  //     //     option_values: [
  //     //       {
  //     //         option_display_name: "Mug Color",
  //     //         label: "Blue",
  //     //       },
  //     //     ],
  //     //   },
  //     //   {
  //     //     price: 10,
  //     //     sku: "SKU-GRAY2",
  //     //     option_values: [
  //     //       {
  //     //         option_display_name: "Mug Color",
  //     //         label: "Gray",
  //     //       },
  //     //     ],
  //     //   },
  //     // ],
  //   };
  //   await axios({
  //     method: "post",
  //     url: "https://us-central1-interasiastock.cloudfunctions.net/app/big/addproduct",
  //     data: data,
  //   })
  //     // .post(
  //     //   `https://us-central1-interasiastock.cloudfunctions.net/app/big/addproduct`,
  //     //   // `https://us-central1-interasiastock.cloudfunctions.net/app/big/getThumbnail`,
  //     //   { params: data }
  //     // )
  //     .then((response) => {
  //       if (response?.data?.id) {
  //         // onSaveButtonClick();
  //         return Appp(response.data.id);
  //       } else if (response?.data?.errors) {
  //         console.log("response.data.errors", response.data.errors);
  //         setToggleBcSaveButton(false);
  //         return alert(`${Object.values(response.data.errors)[0]}`);
  //       } else if (response?.data?.code === 400) {
  //         console.log("response.data.errors", response?.data?.title);
  //         setToggleBcSaveButton(false);
  //         return alert(`${response?.data?.title}`);
  //       } else {
  //         console.log(response);
  //         setToggleBcSaveButton(false);
  //         alert("알 수 없는 오류. 관리자에세 문의해주세요.");
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("요청실패 오류 Catch", e);
  //       setToggleBcSaveButton(false);
  //       alert("알 수 없는 오류. 관리자에세 문의해주세요.");
  //     });
  // };

  // 카테고리
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("cd");

  const [addCat, setAddCat] = useState("");
  const addCategory = async () => {
    // const qweqwe = await db.collection("category").doc("RATES").get();

    // console.log(
    //   Object.values(qweqwe.data()).reduce((a, c) => {
    //     a[`${c}`] = 0;
    //     return a;
    //   }, {})
    // );

    if (addCat.length > 0) {
      try {
        const accounts = await db.collection("accounts").get();
        await db
          .collection("category")
          .doc("RATES")
          .update({
            [`${addCat}`]: addCat,
          });
        accounts.docs.map(
          async (doc) =>
            await db
              .collection("accounts")
              .doc(doc.id)
              .update({
                dcRates: { ...doc.data().dcRates, [`${addCat}`]: 0 },
                dcAmount: {
                  ...doc.data().dcAmount,
                  [`${addCat}A`]: 0,
                },
              })
        );

        alert("추가되었습니다.");
        setAddCat("");
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("올바른 카테고리 이름을 입력하세요");
    }
  };

  const deleteCat = async () => {
    try {
      if (
        category !== "cd" &&
        category !== "beauty" &&
        category !== "dvdBlueRay" &&
        category !== "goods" &&
        category !== "officialStore" &&
        category !== "photoBook"
      ) {
        const qweqwe = await db.collection("category").doc("RATES").get();
        const accounts = await db.collection("accounts").get();

        const categories = qweqwe.data();
        delete categories[category];

        // const deledCat = accounts.docs[41].data().dcRates;
        // const deledCatA = accounts.docs[41].data().dcAmount;

        // delete deledCat[category];
        // delete deledCatA[`${category}A`];

        // await db.collection("accounts").doc(accounts.docs[41].id).update({
        //   dcRates: deledCat,
        //   dcAmount: deledCatA,
        // });
        await db.collection("category").doc("RATES").set(categories);

        accounts.docs.map(async (doc) => {
          const deledCat = doc.data().dcRates;
          const deledCatA = doc.data().dcAmount;

          delete deledCat[category];
          delete deledCatA[`${category}A`];
          await db.collection("accounts").doc(doc.id).update({
            dcRates: deledCat,
            dcAmount: deledCatA,
          });
        });

        alert("카테고리를 삭제했습니다.");
      } else {
        alert("삭제할 수 없는 카테고리 입니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    db.collection("category")
      .doc("RATES")
      .onSnapshot((snapshot) => setCategories(snapshot.data()));
  }, []);

  // useEffect(() => {
  //   callCats();
  // }, []);
  // useEffect(() => {
  //   setParentCat(
  //     cats
  //       .filter((cat) => cat.parent_id === 0)
  //       .sort((a, b) => {
  //         return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  //       })
  //   );
  //   setChildCat(
  //     cats
  //       .filter((cat) => cat.parent_id !== 0)
  //       .sort((a, b) => {
  //         return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  //       })
  //   );
  // }, [cats]);

  return (
    <>
      <div className="w-3/5 m-auto my-20">
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

          {/* 옵션 */}

          <OptionSet
            optionSet={optionSet}
            setOptionSet={setOptionSet}
            optionId={optionId}
            setOptionId={setOptionId}
            optionName={optionName}
          />
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
            <div className="text-gray-600 col-span-1 text-right  mr-3">
              주문마감일
            </div>
            <input
              required
              className="col-span-3 border h-9 pl-3"
              type="datetime-local"
              onChange={onChange}
              value={preOrderDeadline}
              name="preOrderDeadline"
            />
          </div>
          {/* 드랍박스 인풋 */}
          {/* 카테고리 */}
          {/* {selects.map((select, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right  mr-3">
                {selectsName[index]}
              </div>
              <select
                required
                key={index}
                value={category}
                name={Object.keys(select)}
                onChange={onChange}
                className="col-span-3 border h-9 pl-3"
              >
                <option>필수선택</option>
                {Object.values(select)[0].map((option, index) => (
                  <option key={index} value={Object.values(option)}>
                    {Object.keys(option)}
                  </option>
                ))}
              </select>
            </div>
          ))} */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">카테고리</div>
            <select
              required
              value={category}
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3 border h-9 pl-3"
            >
              <option>필수선택</option>
              {Object.keys(categories).map((option, index) => (
                <option key={index} value={categories[option]}>
                  {categories[option]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">
              카테고리 추가하기
            </div>

            <div className="flex flex-row w-full col-span-3 ">
              <input
                type="text"
                className="w-2/3 border p-2"
                value={addCat}
                onChange={(e) => setAddCat(e.target.value)}
              />
              <button
                type="button"
                className=" cursor-pointer bg-gray-600 p-1 text-white ml-5 rounded-sm"
                onClick={() => addCategory()}
              >
                카테고리 추가
              </button>
              <button
                type="button"
                className=" cursor-pointer bg-gray-600 p-1 text-white ml-5 rounded-sm"
                onClick={() => deleteCat()}
              >
                카테고리 삭제
              </button>
            </div>
          </div>
          {/* {console.log("category", category)} */}
          {/* restockable, 활성/비활성 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">재고추가가능</div>
            <select
              required
              name="reStockable"
              onChange={onChange}
              value={reStockable}
              className="col-span-3 border h-9 pl-3"
            >
              <option>필수선택</option>
              <option value="가능">가능</option>
              <option value="불가능">불가능</option>
            </select>
          </div>
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right  mr-3">B2B 활성화</div>
            <select
              required
              name="exposeToB2b"
              value={exposeToB2b}
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
            >
              <option>필수선택</option>
              <option value="노출">노출</option>
              <option value="숨김">숨김</option>
              <option value="DEAL">DEAL</option>
            </select>
          </div>
          {/*썸넬 */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right mr-3">썸네일</div>
            <input
              className="col-span-3 border h-9 pl-2"
              type="text"
              onChange={handleThumbnail}
              name="thumbnailUrl"
              value={thumbnailUrl}
              placeholder="이미지 주소 복사해서 붙혀넣기 후 엔터. 소요시간 10초"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  getImages();
                  return false;
                }
              }}
            />
          </div>
          {/*disc */}
          <div className="grid grid-cols-4 p-2 items-center">
            <div className="text-gray-600 text-right mr-3">상세페이지</div>
            <input
              className="col-span-3 border h-9 pl-2"
              type="text"
              onChange={handleDiscrip}
              name="discripUrl"
              value={discripUrl}
              placeholder="이미지 주소 복사해서 붙혀넣기 후 엔터. 소요시간 10초"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  getDisc();
                  return false;
                }
              }}
            />
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
              // disabled={!toggleSaveButton}
              // type="submit"
              onClick={() => Appp()}
              className={`${"bg-gray-600"} py-2 px-10 rounded 
            text-gray-200 text-lg font-light`}
            >
              SAVE
            </button>
          </div>
        </div>
        {/* 빅커머스 */}
        {/* <AddBigc
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
          thumbnailUrl={thumbnailUrl}
          handleThumbnail={handleThumbnail}
          discripUrl={discripUrl}
          handleDiscrip={handleDiscrip}
          setDescr={setDescr}
          category={category}
          descr={descr}
          addBig={addBig}
          toggleBcSaveButton={toggleBcSaveButton}
        /> */}
      </div>
    </>
  );
};

export default AddProduct;
