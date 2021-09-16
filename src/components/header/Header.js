import React from "react";
import { useHistory } from "react-router";
import { auth } from "../../firebase";

const Header = () => {
  const history = useHistory();
  return (
    <div className=" bg-blue-900 w-screen p-3 absolute top-0 z-30 flex flex-row justify-between">
      <div
        className="text-gray-200 font-semibold text-left mr-10 cursor-pointer w-20 pl-5"
        onClick={() => history.replace("/b2bshop")}
      >
        INTERASIA
      </div>

      {/* 버튼들 */}
      <div className="pr-5 flex flex-row">
        <div
          onClick={() => history.replace("/b2bshop")}
          className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 mr-8 cursor-pointer"
        >
          Home
        </div>
        <div
          onClick={() => history.goBack()}
          className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 mr-8 cursor-pointer"
        >
          GoBack
        </div>
        <div
          onClick={async () => {
            await auth.signOut();
            await history.replace("/");
          }}
          className="text-sm font-mono font-bold text-center 
          text-gray-200 bg-blue-900 cursor-pointer"
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
