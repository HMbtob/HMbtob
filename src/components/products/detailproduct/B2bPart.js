import React from "react";
import useInputs from "../../../hooks/useInput";
import { db } from "../../../firebase";
import { useHistory } from "react-router";

const B2bPart = ({ product }) => {
  const history = useHistory();
  const [
    {
      title,
      price,
      relDate,
      thumbNail,
      category,
      preOrderDeadline,
      pob,
      poster,
      photocard,
      postcard,
      gift,
    },
    onChange,
    reset,
  ] = useInputs({
    title: product.data.title,
    price: product.data.price,
    relDate: product.data.relDate,
    thumbNail: product.data.thumbNail,
    category: product.data.category,
    preOrderDeadline: product.data.preOrderDeadline,
    pob: false,
    poster: false,
    photocard: false,
    postcard: false,
    gift: false,
  });

  // 체크박스 인풋
  const checkboxInput = [
    { pob: "선주문특전" },
    { poster: "포스터" },
    { photocard: "포토카드" },
    { postcard: "엽서" },
    { gift: "특전" },
  ];

  //   B2B shop 에 등록
  const addToB2bShop = () => {
    db.collection("b2bshop")
      .doc()
      .set({
        title,
        price,
        thumbNail,
        relDate: new Date(relDate),
        preOrderDeadline: new Date(preOrderDeadline),
        options: {
          pob,
          poster,
          photocard,
          postcard,
          gift,
        },
      });
    reset();
    history.push("/listproduct");
  };

  return (
    <div className="w-5/6 m-auto my-20">
      <div
        className="text-left text-xl  
            text-gray-800 mb-1 ml-2 "
      >
        B2B
      </div>
      <div>
        <button
          onClick={addToB2bShop}
          className="py-1 px-2 mx-3 my-2 bg-gray-500 
        rounded-md text-gray-200 text-sm"
        >
          등록
        </button>
      </div>
      <div className="bg-white p-10 border">
        <div className="grid-cols-2 grid">
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className="text-right pr-5 col-span-1">제목</div>
            <input
              onChange={onChange}
              value={title}
              name="title"
              type="text"
              className="border p-1 col-span-4"
            />
          </div>
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className="text-right pr-5 col-span-1">가격</div>
            <input
              onChange={onChange}
              value={price}
              name="price"
              type="text"
              className="border p-1 col-span-4"
            />
          </div>
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className="text-right pr-5 col-span-1">썸네일</div>
            <input
              onChange={onChange}
              value={thumbNail}
              name="thumbNail"
              type="text"
              className="border p-1 col-span-4"
            />
          </div>
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className="text-gray-600 text-right  mr-3">카테고리 </div>
            <select
              name="category"
              onChange={onChange}
              className="col-span-3 border h-9 pl-3"
              value={category}
            >
              <option value="cd">cd</option>
              <option value="dvd">dvd</option>
              <option value="per">per</option>
              <option value="goods">goods</option>
              <option value="limited">limited</option>
              <option value="beauty">beauty</option>
            </select>
          </div>
          <div className="col-span-2 mb-5">
            <div className="mt-10 mb-3 text-gray-800 text-lg text-center">
              OPTIONS
            </div>
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
          </div>
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className="col-span-2 text-gray-600 text-right  mr-3">
              출시일
            </div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="relDate"
              //   value={moment(new Date(relDate.toDate())).format("YYYY-MM-DD")}
            />
          </div>
          <div className="grid grid-cols-5 m-3 px-12 items-center ">
            <div className=" col-span-2 text-gray-600 text-right  mr-3">
              주문마감일
            </div>
            <input
              className="col-span-3 border h-9 pl-3"
              type="date"
              onChange={onChange}
              name="preOrderDeadline"
              //   value={moment(preOrderDeadline.toDate()).format("YYYY-MM-DD")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2bPart;
