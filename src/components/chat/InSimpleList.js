import React from "react";

const InSimpleList = ({ user, rooms }) => {
  console.log(user, rooms);
  return (
    <>
      <div className="bg-red-200 flex flex-row justify-between">
        <div>
          {user.nickName} / {user.email}
        </div>
        <div> Details </div>{" "}
      </div>{" "}
      <div className="bg-gray-200 h-96 overflow-y-auto flex-1">
        <div className="bg-yellow-200">messages</div>
      </div>
      <div className="bg-green-200">input</div>
    </>
  );
};

export default InSimpleList;
