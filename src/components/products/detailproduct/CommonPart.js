import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { InitDataContext } from "../../../App";
import { db, storage } from "../../../firebase";
import useInputs from "../../../hooks/useInput";
import AddBigc from "../addproduct/AddBigc";
import firebase from "firebase";

const CommonPart = ({ product, id }) => {
  const state = useContext(InitDataContext);
  const { user } = state;
  const [cats, setCats] = useState([]);
  const [parentCat, setParentCat] = useState([]);
  const [childCat, setChildCat] = useState([]);
  const [lastId, setLastId] = useState("");
  const [bigC, setBigC] = useState("");

  // 썸넬

  const [thumbnailUrl, setThumbnailUrl] = useState(product.data.thumbNail);
  const handleThumbnail = e => {
    setThumbnailUrl(e.target.value);
  };
  // 디스크립션-이미지

  const [discripUrl, setDiscripUrl] = useState(product.data.discripUrl || "");
  const handleDiscrip = e => {
    setDiscripUrl(e.target.value);
  };
  // 디스크립션 텍스트
  // const [descr, setDescr] = useState(product.data.descr || "");
  // const handleDesc = e => {
  //   setDescr(e.target.value);
  // };
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
    sku: product.data.sku,
    title: product.data.title,
    purchasePrice: product.data.purchasePrice,
    price: product.data.price,
    artist: product.data.artist,
    ent: product.data.ent,
    weight: product.data.weight,
    x: product.data.x,
    y: product.data.y,
    z: product.data.z,
    category: product.data.category,
    relDate: new Date(product.data.relDate.seconds * 1000)
      .toISOString()
      .substring(0, 10),
    preOrderDeadline: new Date(product.data.preOrderDeadline.seconds * 1000)
      .toISOString()
      .substring(0, 19),
    pob: false,
    poster: false,
    photocard: false,
    weverseGift: false,
    interAsiaPhotocard: false,
    barcode: product.data.barcode,
    reStockable: product.data.reStockable,
    exposeToB2b: product.data.exposeToB2b,
    inventoryLevel: product.data.inventoryLevel,
    brandId: product.data.brandId,
    brandName: product.data.brandName,
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
    { weight: "무게" },
    { x: "가로" },
    { y: "세로" },
    { z: "높이" },
    { barcode: "바코드" },
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
    weight,
    x,
    y,
    z,
    relDate,
    preOrderDeadline,
    preOrderDeadlineTime,
    poster,
    pob,
    photocard,
    weverseGift,
    interAsiaPhotocard,
    barcode,
    reStockable,
    exposeToB2b,
    price,
    // 이하 빅커머스용 변수
    inventoryLevel,
    brandId,
    brandName,
    customFieldName,
  } = form;
  // const callCats = async () => {
  //   await axios
  //     .get(
  //       `https://us-central1-interasiastock.cloudfunctions.net/app/big/getcategory`
  //     )
  //     .then(cats => setCats(cats.data.data))
  //     .catch(error => console.log(error));
  // };

  // const callLastId = async () => {
  //   await axios
  //     .get(
  //       `https://us-central1-interasiastock.cloudfunctions.net/app/big/getlastproductid`,

  //       {
  //         params: { sort: "id", direction: "desc", limit: 1 },
  //         headers: {
  //           "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
  //           accept: "application/json",
  //           "content-type": "application/json",
  //         },
  //       }
  //     )
  //     .then(ids => setLastId(ids.data.data))
  //     .catch(error => console.log(error));
  // };
  // 섬넬
  const getImages = async () => {
    // await setImgUrl(thumbnailUrl.substring(25));
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
      .then(res => setThumbnailUrl(res.data))
      .catch(e => console.log(e));
  };
  console.log(thumbnailUrl);
  // 디스크립션
  const getDisc = async () => {
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
      .then(res => setDiscripUrl(res.data))
      .catch(e => console.log(e));
  };

  const Appp = async e => {
    e.preventDefault();
    // 빅커머스 가장 최근 아이디 가져와서
    //  + 1 해서 id 로 저장
    // if (lastId) {
    // const headers = {
    //   "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
    //   accept: "application/json",
    //   "content-type": "application/json",
    // };

    // await axios
    //   .post(
    //     `/stores/7uw7zc08qw/v3/catalog/products`,
    //     {
    //       name: title,
    //       price: Number(price),
    //       weight: Number(weight),
    //       type: "physical",
    //       custom_fields: [{ name: customFieldName, value: relDate }],
    //       images: [{ is_thumbnail: true, image_url: thumbnailUrl }],
    //       sku: sku,
    //       upc: barcode,
    //       inventory_tracking: "product",
    //       inventory_level: inventoryLevel,
    //       brand_name: brandName,
    //       categories: checkedInputs,
    //       description: `${descr} + <img src=${discripUrl} alt="" />`,
    //     },
    //     { headers }
    //   )
    //   .then()
    //   .catch(error => console.log(error));

    // await axios
    //   .get(`/stores/7uw7zc08qw/v3/catalog/products/${lastId[0]?.id + 1}`, {
    //     headers: {
    //       "x-auth-token": "23t2vx6zwiq32xa8b0uspfo7mb7181x",
    //       accept: "application/json",
    //       "content-type": "application/json",
    //     },
    //   })
    //   .then(pro => setBigC(pro.data.data))
    //   .catch(error => console.log(error));

    // 복사 or 수정?
    await db
      .collection("products")
      .doc(id)
      .update({
        sku,
        purchasePrice: Number(purchasePrice),
        price: Number(price),
        artist,
        ent,
        x: Number(x),
        y: Number(y),
        z: Number(z),
        title,
        thumbNail: thumbnailUrl,
        discripUrl,
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
        // bigC: bigC,
        productMemo: firebase.firestore.FieldValue.arrayUnion({
          memo: "Fix product on list",
          date: new Date(),
          writer:
            user.nickName && user.nickName.length > 0
              ? user.nickName
              : user.email,
        }),
        // limitedStock: false,
        // totalStock: stock,
        // totalSold: 0,
        // stockHistory: [
        //   {
        //     type: "Fix product on list",
        //     writer: user.nickName && user.nickName.length > 0 ? user.nickName : user.email,
        //     amount: 0,
        //     date: new Date(),
        //   },
        // ],
        // descr,
      });
    // 파이어 베이스 저장 후
    // 빅커머스 상품등록
    // 디폴트
    // type : physical
    // inventory_tracking : product

    await alert("수정완료");
    // FIXME: 저장버튼 어디다 둘지, 따로둘지, 저장후 어디로 갈지?
    // history.push("/listproduct");
    // } else {
    //   alert("실패");
    // }
  };

  // useEffect(() => {
  //   callCats();
  //   callLastId();
  // }, []);
  // useEffect(() => {
  //   setParentCat(
  //     cats
  //       .filter(cat => cat.parent_id === 0)
  //       .sort((a, b) => {
  //         return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  //       })
  //   );
  //   setChildCat(
  //     cats
  //       .filter(cat => cat.parent_id !== 0)
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
          상품 수정
        </div>

        <div className="bg-white p-10 border">
          {Inputs.map((doc, index) => (
            <div key={index} className="grid grid-cols-4 p-2 items-center">
              <div className="text-gray-600 text-right mr-3">
                {Object.values(doc)}
              </div>
              <input
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
              className="col-span-3 border h-9 pl-3"
              type="datetime-local"
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
                value={category}
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
          ))}
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
              onChange={onChange}
              value={exposeToB2b}
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
              onKeyPress={e => {
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
              onKeyPress={e => {
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
              // type="submit"
              onClick={Appp}
              className="bg-gray-600 py-2 px-10 rounded 
            text-gray-200 text-lg font-light
             "
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
        /> */}
      </div>
    </>
  );
};

export default CommonPart;

// import React from "react";
// import { db } from "../../../firebase";
// import useInputs from "../../../hooks/useInput";

// const CommonPart = ({ product, id }) => {
//   const [form, onChange] = useInputs({
//     sku: product.data.sku,
//     title: product.data.title,
//     purchasePrice: product.data.purchasePrice,
//     price: product.data.price,
//     artist: product.data.artist,
//     ent: product.data.ent,
//     thumbNail: product.data.thumbNail,
//     descrip: product.data.descrip,
//     weight: product.data.weight,
//     x: product.data.x,
//     y: product.data.y,
//     z: product.data.z,
//     category: product.data.category,
//     relDate: new Date(product?.data?.relDate?.seconds * 1000)
//       .toISOString()
//       .substring(0, 10),
//     preOrderDeadline: new Date(product?.data?.preOrderDeadline?.seconds * 1000)
//       .toISOString()
//       .substring(0, 10),
//     pob: product.data.options.pob,
//     poster: product.data.options.poster,
//     photocard: product.data.options.photocard,
//     weverseGift: product.data.options.weverseGift,
//     interAsiaPhotocard: product.data.options.interAsiaPhotocard,
//     barcode: product.data.barcode,
//     reStockable: product.data.reStockable,
//     stock: product.data.stock,
//     exposeToB2b: product.data.exposeToB2b,
//   });
//   const {
//     sku,
//     title,
//     purchasePrice,
//     artist,
//     ent,
//     category,
//     thumbNail,
//     descrip,
//     weight,
//     x,
//     y,
//     z,
//     relDate,
//     preOrderDeadline,
//     poster,
//     pob,
//     photocard,
//     weverseGift,
//     interAsiaPhotocard,
//     barcode,
//     reStockable,
//     stock,
//     exposeToB2b,
//     price,
//   } = form;

//   // 텍스트 숫자인풋
//   const Inputs = [
//     { sku: "sku" },
//     { title: "제목" },
//     { purchasePrice: "매입가" },
//     { artist: "그룹명" },
//     { ent: "소속사" },
//     { thumbNail: "썸네일" },
//     { descrip: "상세페이지" },
//     { weight: "무게" },
//     { x: "가로" },
//     { y: "세로" },
//     { z: "높이" },
//     { barcode: "바코드" },
//     { stock: "재고" },
//     { price: "도매가" },
//   ];

//   // 셀렉트인풋
//   const selects = [
//     {
//       category: [
//         { cd: "cd" },
//         { "dvd/blue-ray": "dvdBlueRay" },
//         { "photo book": "photoBook" },
//         { goods: "goods" },
//         { "official store": "officialStore" },
//         { beauty: "beauty" },
//       ],
//     },
//   ];

//   const selectsName = ["카테고리"];

//   // 체크박스 인풋
//   const checkboxInput = [
//     { poster: "Poster" },
//     { pob: "POB" },
//     { photocard: "Photocard" },
//     { weverseGift: "Weverse Gift" },
//     { interAsiaPhotocard: " InterAsia Photocard" },
//   ];
//   const Appp = async e => {
//     e.preventDefault();

//     await db
//       .collection("products")
//       .doc(id)
//       .update({
//         sku,
//         purchasePrice: Number(purchasePrice),
//         price: Number(price),
//         artist,
//         ent,
//         x: Number(x),
//         stock: stock,
//         y: Number(y),
//         z: Number(z),
//         title,
//         thumbNail,
//         descrip,
//         weight: Number(weight),
//         category,
//         relDate: new Date(relDate),
//         preOrderDeadline: new Date(preOrderDeadline),
//         options: {
//           poster,
//           pob,
//           photocard,
//           weverseGift,
//           interAsiaPhotocard,
//         },
//         barcode,
//         reStockable,
//         exposeToB2b,
//       });

//     await alert("수정 완료");
//   };
//   return (
//     <div className="w-5/6 m-auto my-20">
//       <div
//         className="text-left text-xl
//         text-gray-800 mb-1 ml-2 "
//       >
//         COMMON
//       </div>
//       <form className="bg-white p-10 border" onSubmit={Appp}>
//         {Inputs.map((doc, index) => (
//           <div key={index} className="grid grid-cols-4 p-2 items-center">
//             <div className="text-gray-600 text-right mr-3">
//               {Object.values(doc)}
//             </div>
//             <input
//               required
//               className="col-span-3 border h-9 pl-2"
//               type="text"
//               onChange={onChange}
//               value={form[Object.keys(doc)]}
//               name={Object.keys(doc)}
//             />
//           </div>
//         ))}{" "}
//         {/* 날짜 인풋 */}
//         <div className="grid grid-cols-4 p-2 items-center">
//           <div className="text-gray-600 text-right  mr-3">출시일</div>
//           <input
//             required
//             className="col-span-3 border h-9 pl-3"
//             type="date"
//             onChange={onChange}
//             value={relDate}
//             name="relDate"
//           />
//         </div>
//         <div className="grid grid-cols-4 p-2 items-center">
//           <div className="text-gray-600 text-right  mr-3">주문마감일</div>
//           <input
//             required
//             className="col-span-3 border h-9 pl-3"
//             type="date"
//             onChange={onChange}
//             value={preOrderDeadline}
//             name="preOrderDeadline"
//           />
//         </div>
//         {/* 드랍박스 인풋 */}
//         {/* 카테고리 */}
//         {selects.map((select, index) => (
//           <div key={index} className="grid grid-cols-4 p-2 items-center">
//             <div className="text-gray-600 text-right  mr-3">
//               {selectsName[index]}
//             </div>
//             <select
//               required
//               key={index}
//               name={Object.keys(select)}
//               onChange={onChange}
//               value={form[Object.keys(select)]}
//               className="col-span-3 border h-9 pl-3"
//             >
//               {/* <option value="" defaultValue>
//                 필수선택
//               </option> */}
//               {Object.values(select)[0].map((option, index) => (
//                 <option key={index} value={Object.values(option)}>
//                   {Object.keys(option)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//         {/* restockable, 활성/비활성 */}
//         <div className="grid grid-cols-4 p-2 items-center">
//           <div className="text-gray-600 text-right  mr-3">재고추가가능</div>
//           <select
//             required
//             name="reStockable"
//             onChange={onChange}
//             value={reStockable}
//             className="col-span-3 border h-9 pl-3"
//           >
//             {/* <option value="" defaultValue>
//               필수선택
//             </option> */}
//             <option value="가능">가능</option>
//             <option value="불가능">불가능</option>
//           </select>
//         </div>
//         <div className="grid grid-cols-4 p-2 items-center">
//           <div className="text-gray-600 text-right  mr-3">B2B 활성화</div>
//           <select
//             required
//             name="exposeToB2b"
//             onChange={onChange}
//             value={exposeToB2b}
//             className="col-span-3 border h-9 pl-3"
//           >
//             {/* <option value="" defaultValue>
//               필수선택
//             </option> */}
//             <option value="노출">노출</option>
//             <option value="숨김">숨김</option>
//             <option value="DEAL">DEAL</option>
//           </select>
//         </div>
//         {/* 체크박스 인풋 */}
//         <div className="mt-10 mb-3 text-gray-800 text-lg">OPTIONS</div>
//         <div className="grid grid-cols-3">
//           {checkboxInput.map((doc, index) => (
//             <div key={index} className="grid grid-cols-2 p-2 items-center">
//               <div key={index} className="text-gray-600 text-right mr-3">
//                 {Object.values(checkboxInput[index])}
//               </div>
//               <input
//                 className=""
//                 type="checkbox"
//                 onChange={onChange}
//                 name={Object.keys(doc)}
//                 value={form[Object.values(checkboxInput[index])]}
//               />
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-gray-600 py-2 px-10 rounded
//             text-gray-200 text-lg font-light
//              "
//           >
//             SAVE
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CommonPart;
