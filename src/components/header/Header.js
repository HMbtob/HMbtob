import React, { useContext } from "react";
import { useHistory } from "react-router";
import { auth } from "../../firebase";

const Header = () => {
  // console.log(window.location.pathname);

  const history = useHistory();
  return (
    <div className=" bg-blue-900 w-screen p-3 sticky top-0 z-30 flex flex-row justify-between">
      <div
        className="text-gray-200 font-semibold text-left mr-10 cursor-pointer w-20 pl-5"
        onClick={() => history.replace("/b2bshop")}
      >
        INTERASIA
      </div>

      {/* 버튼들 */}
      <div className="pr-5">
        <div
          onClick={() => auth.signOut()}
          className="text-sm font-mono font-bold text-center text-gray-200 bg-blue-900"
        >
          logout
        </div>
      </div>
    </div>
  );
};

export default Header;
