import React from "react";
import { useHistory } from "react-router";
const Header = () => {
  const history = useHistory();
  return (
    <div className=" bg-blue-900 w-screen p-2 sticky top-0 z-10">
      <div
        className="text-gray-200 font-semibold text-left mr-10 cursor-pointer"
        onClick={() => history.replace("/b2bshop")}
      >
        INTERASIA
      </div>
    </div>
  );
};

export default Header;
