export function SecondContainer({ top5, byUser }) {
  return (
    <div className="flex flex-row w-full items-center mt-12">
      <div className="w-1/2">
        <div>Top 5 Sales</div>
        {top5 &&
          top5.map((doc, i) => (
            <div key={i} className="flex flex-row">
              <div>{doc.title}</div>
              <div>{doc.quan}</div>
              <div>{doc.totalPrice}</div>
            </div>
          ))}
      </div>
      <div className="w-1/2">
        {byUser &&
          byUser.map((doc, i) => (
            <div key={i} className="flex flex-row">
              <div>{doc.nickName}</div>
              <div>{doc.quan}</div>
              <div>{doc.totalPrice}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
