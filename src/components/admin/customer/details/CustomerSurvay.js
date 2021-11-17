import React from "react";

export function CustomerSurvay({ user }) {
  return (
    <div className="w-1/2 mb-12">
      <div
        className="text-center text-md bg-gray-800 
            rounded text-gray-100 mb-5 mt-5 w-full py-1"
      >
        SURVAY
      </div>
      <div>
        {Object.keys(user?.data?.survay).map((sur, i) => (
          <div key={i} className="grid grid-cols-3 p-1 text-gray-800">
            <div className="text-right pr-2">{sur} :</div>
            <div className="col-span-2">
              {Object.values(user?.data?.survay)[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
