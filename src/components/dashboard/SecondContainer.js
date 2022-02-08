export function SecondContainer({ top5, byUser }) {
  return (
    <div className="flex flex-row w-full items-center mt-12">
      <div className="w-3/5 p-10">
        <div className="font-semibold text-lg">Top 5 Sales</div>
        <div className="grid grid-cols-9 border-b text-center text-sm font-semibold">
          <div className="col-span-7">Title</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-1">Price</div>
        </div>
        {top5 &&
          top5.map((doc, i) => (
            <div key={i} className="grid grid-cols-9 border-b text-xs">
              <div className="col-span-7 pl-2 py-2 ">{doc.title}</div>
              <div className="col-span-1 text-right pr-3 py-2">
                {doc.quan.toLocaleString()}
              </div>
              <div className="col-span-1 text-right pr-3 py-2">
                {Number(doc.totalPrice.toFixed(0)).toLocaleString()}
              </div>
            </div>
          ))}
      </div>
      <div className="w-2/5 p-10">
        <div className="font-semibold text-lg">Top 5 Users</div>
        <div className="grid grid-cols-9 border-b text-center text-sm font-semibold ">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Price</div>
        </div>
        {byUser &&
          byUser.map((doc, i) => (
            <div key={i} className="grid grid-cols-9 border-b  text-xs">
              <div className="col-span-5 pl-2 py-2 ">{doc.nickName}</div>
              <div className="col-span-2 text-right pr-3 py-2">
                {doc.quan.toLocaleString()}
              </div>
              <div className="col-span-2 text-right pr-3 py-2">
                {Number(doc.totalPrice.toFixed(0)).toLocaleString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
