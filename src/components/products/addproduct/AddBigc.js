import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddBigc = ({
  sku,
  title,
  price,
  weight,
  relDate,
  barcode,
  inventoryLevel,
  brandName,
  onChange,
  customFieldName,
  parentCat,
  childCat,
  checkedInputs,
  changeHandler,
  thumbnailUrl,
  handleThumbnail,
  discripUrl,
  handleDiscrip,
  setDescr,
  category,
  addBig,
  toggleBcSaveButton,
}) => {
  return (
    <>
      <div
        className="text-left text-2xl  
                 text-gray-800 mb-1 ml-2 mt-10"
      >
        상품 추가
      </div>
      <div className="bg-white p-10 border">
        {/* 상품명 */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Name </div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="text"
            onChange={onChange}
            name="title"
            value={title}
          />
        </div>
        {/* 가격 */}
        <div className="grid grid-cols-4 p-2">
          <div className="text-gray-600 text-right mr-3">Price(USD)</div>
          {/* <input
            className="col-span-3 border h-9 pl-2"
            type="number"
            onChange={onChange}
            name="price"
            value={price}
          /> */}

          <div className="pl-2 text-lg">
            {category && category === "cd"
              ? (price / 1100).toFixed(2)
              : category === "officialStore"
              ? ((price * 0.8) / 1100).toFixed(2)
              : ((price * 0.9) / 1100).toFixed(2)}
          </div>
        </div>
        {/* 카테고리.... */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3 col-span-1">
            Category{" "}
          </div>
          <div className="col-span-3 w-full text-sm">
            {parentCat &&
              parentCat.map((cat, i) => (
                <div key={i} className=" flex-col flex w-full">
                  <div className="flex-row flex items-center justify-start mt-2">
                    <input
                      required
                      type="checkbox"
                      id={cat.id}
                      className="mr-1"
                      onChange={e => {
                        changeHandler(e.currentTarget.checked, cat.id);
                      }}
                      checked={checkedInputs.includes(cat.id) ? true : false}
                    />{" "}
                    <div>{cat.name}</div>
                  </div>
                  {childCat
                    ?.filter(cCat => cCat.parent_id === cat.id)
                    .map((doc, ii) => (
                      <div
                        key={ii}
                        className="ml-5 flex flex-row items-center text-xs"
                      >
                        <input
                          required
                          type="checkbox"
                          id={doc.id}
                          className="mr-1"
                          onChange={e => {
                            changeHandler(e.currentTarget.checked, doc.id);
                          }}
                          checked={
                            checkedInputs.includes(doc.id) ? true : false
                          }
                        />{" "}
                        <div>{doc.name}</div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>

        {/* sku */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Product code/SKU</div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="text"
            onChange={onChange}
            name="sku"
            value={sku}
          />
        </div>
        {/* weight */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">weight(KG)</div>
          <input
            disabled
            className="col-span-3 border h-9 pl-2"
            type="number"
            onChange={onChange}
            name="weight"
            value={weight * 0.001}
          />
        </div>
        {/* inventory_level */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">inventory_level</div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="number"
            onChange={onChange}
            name="inventoryLevel"
            value={inventoryLevel}
          />
        </div>
        {/* brand Name */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Brand Name</div>
          {/* FIXME: get all brand 로 브랜드값 가져오기 */}
          <input
            className="col-span-2 border h-9 pl-2"
            type="text"
            onChange={onChange}
            name="brandName"
            value={brandName}
          />
        </div>
        {/* inventory_level */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Product UPC/EAN</div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="number"
            onChange={onChange}
            name="barcode"
            value={barcode}
          />
        </div>
        {/* Custom_fields */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Custom_fields</div>
          <input
            className="col-span-1 border h-9 pl-2"
            type="text"
            onChange={onChange}
            name="customFieldName"
            value={customFieldName}
          />
          <input
            className="col-span-2 border h-9 pl-2"
            type="date"
            onChange={onChange}
            name="relDate"
            value={relDate}
          />
        </div>
        {/* thumbnail */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Thumb Nail</div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="text"
            onChange={handleThumbnail}
            name="thumbnailUrl"
            value={thumbnailUrl}
          />
        </div>
        {/* thumbnail */}
        <div className="grid grid-cols-4 p-2 items-center">
          <div className="text-gray-600 text-right mr-3">Discription Image</div>
          <input
            className="col-span-3 border h-9 pl-2"
            type="text"
            onChange={handleDiscrip}
            name="discripUrl"
            value={discripUrl}
          />
        </div>
        {/* disc */}
        <div className="p-2 items-center w-full h-full">
          <div className="text-gray-600 text-left mr-3">Discription</div>
          <CKEditor
            editor={ClassicEditor}
            className="col-span-3 border pl-2 w-full"
            type="text"
            onChange={(ev, ed) => {
              const data = ed.getData();
              setDescr(data);
            }}
            name="disc"
          />
        </div>
        <button
          // type="submit"
          disabled={toggleBcSaveButton}
          onClick={() => addBig()}
          className={`${
            toggleBcSaveButton ? "bg-gray-400" : "bg-gray-600"
          } " py-2 px-10 rounded text-gray-200 text-lg font-light"`}
        >
          SAVE
        </button>
      </div>
    </>
  );
};

export default AddBigc;
