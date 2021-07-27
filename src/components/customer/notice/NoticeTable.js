import React from "react";
import NoticeTableRow from "./NoticeTableRow";

const NoticeTable = ({ notices }) => {
  return (
    <div className="w-4/12 overflow-y-auto">
      <div>
        <div className="text-center text-sm font-bold text-gray-800">
          NOTICE
        </div>
        <div
          className="grid grid-cols-10 grid-flow-col 
        text-center bg-gray-800 p-1 
        text-gray-200 
         text-xs"
        >
          <div className="col-span-1">No.</div>
          <div className="col-span-7">TITLE</div>
          <div className="col-span-2">DATE</div>
        </div>

        <div>
          {notices.map(doc => (
            <NoticeTableRow
              key={doc.id}
              id={doc.id}
              title={doc.data.title}
              content={doc.data.content}
              createdAt={doc.data.createdAt}
              index={doc.data.index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeTable;
