export default function CommonRow({
  id,
  title,
  relDate,
  thumbNail,
  name,
  onChange,
  price,
}) {
  return (
    <div
      id={id}
      className="grid grid-cols-20 place-items-center text-center 
      text-sm border-b border-l border-r py-1 bg-white"
    >
      <img
        className="col-span-3 h-10 bg-contain bg-center bg-no-repeat rounded-sm"
        src={thumbNail}
        alt={title}
      />

      <div className="col-span-8">{title}</div>
      <div className="col-span-3">
        {new Date(relDate.toDate()).toLocaleDateString()}
      </div>
      <div className="col-span-3">{price} 원</div>
      {/* 재고 */}
      {/* 재고보다 많으면 밸리데이션 오류나게 */}
      {/* 아니면 그냥 주문받고 추가로 주문하나? */}
      <input
        type="number"
        name={name}
        onChange={onChange}
        className="w-1/2 h-7 border text-center col-span-3"
      />
    </div>
  );
}
