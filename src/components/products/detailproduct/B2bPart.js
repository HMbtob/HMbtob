import React from "react";

const B2bPart = () => {
  //   B2B shop 에 활성/비활성

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
          // onClick={}
          className="py-1 px-2 mx-3 my-2 bg-gray-500 
        rounded-md text-gray-200 text-sm"
        >
          등록
        </button>
      </div>
      <div className="bg-white p-10 border">내용</div>
    </div>
  );
};

export default B2bPart;
