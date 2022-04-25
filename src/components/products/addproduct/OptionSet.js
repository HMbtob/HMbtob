import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

export function OptionSet({
  optionSet,
  setOptionSet,
  optionId,
  setOptionId,
  optionName,
}) {
  const [optionSets, setOptionSets] = useState([]);

  const handleOptionSet = (e, i) => {
    setOptionSet(
      [...optionSet],
      e.target.name === "optionName" || e.target.name === "optionBarcode"
        ? (optionSet[i][e.target.name] = e.target.value)
        : (optionSet[i][e.target.name] = Number(e.target.value))
    );
  };

  // 옵션 추가
  const addOption = () => {
    try {
      db.collection("optionSet").doc(optionId).collection("options").add({
        no: optionSet.length,
        optionName: "",
        optionPrice: 0,
        optionStock: 0,
        optionBarcode: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  // 세트 추가
  const [addOptionSetName, setAddOptionSetName] = useState("");
  const addOptionSet = async () => {
    try {
      if (addOptionSetName.length > 0) {
        await db
          .collection("optionSet")
          .add({ optionSetName: addOptionSetName });
        setAddOptionSetName("");
        alert("세트를 추가 했습니다.");
        return;
      } else {
        alert("옵션 세트이름을 입력해주세요.");
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 세트 저장
  const saveOptionSet = () => {
    try {
      optionSet.map(
        async (option) =>
          await db
            .collection("optionSet")
            .doc(optionId)
            .collection("options")
            .doc(option.id)
            .update({
              optionName: option.optionName,
              optionPrice: option.optionPrice,
              optionStock: option.optionStock,
              optionBarcode: option.optionBarcode,
            })
      );
      alert("세트를 저장 했습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  // 세트 삭제
  const deleteOptionSet = async () => {
    try {
      await optionSet.map(
        async (option) =>
          await db
            .collection("optionSet")
            .doc(optionId)
            .collection("options")
            .doc(option.id)
            .delete()
      );
      await db.collection("optionSet").doc(optionId).delete();
      setOptionId("no");
      alert("세트를 삭제 했습니다.");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    db.collection("optionSet").onSnapshot((snapshot) =>
      setOptionSets(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      )
    );
  }, []);

  useEffect(() => {
    db.collection("optionSet")
      .doc(optionId)
      .collection("options")
      .orderBy("no", "asc")
      .onSnapshot((snapshot) =>
        setOptionSet(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      );
  }, [optionId, setOptionSet]);
  return (
    <div>
      <div className="grid grid-cols-4 p-2 items-center">
        <div className="text-gray-600 text-right mr-3">옵션추가</div>
        <select
          className="border p-1"
          value={optionId}
          onChange={(e) => setOptionId(e.target.value)}
        >
          <option value="no">선택안함</option>
          {optionSets.map((op) => (
            <option value={op.id}>{op.data.optionSetName}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 p-2 items-center">
        {optionId === "no" ? (
          <>
            <div></div>
            <input
              type="text"
              className="border p-1 outline-none"
              value={addOptionSetName}
              onChange={(e) => setAddOptionSetName(e.target.value)}
            />
            <button
              className=" cursor-pointer bg-gray-600 p-1 text-white ml-5 rounded-sm"
              type="button"
              onClick={() => addOptionSet()}
            >
              세트 추가
            </button>
          </>
        ) : (
          <>
            <div></div>
            <div className="font-semibold text-base">
              세트 이름 : {optionName?.optionSetName}
            </div>
            <div
              onClick={() => saveOptionSet()}
              className="cursor-pointer text-center bg-gray-600 p-1 text-white ml-5 rounded-sm"
            >
              세트 저장
            </div>
            <div
              onClick={() => deleteOptionSet()}
              className="cursor-pointer text-center bg-gray-600 p-1 text-white ml-5 rounded-sm"
            >
              세트 삭제
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-4 p-2 items-center">
        <div></div>
        <div className="col-span-3 flex flex-col w-full">
          <div className="grid grid-cols-5 items-center">
            {optionId !== "no" && (
              <>
                <div
                  onClick={() => addOption()}
                  className="cursor-pointer text-center bg-gray-600 p-1 text-white ml-5 rounded-sm mb-1"
                >
                  옵션 추가
                </div>
                <div className="border text-center p-1">옵션이름</div>
                <div className="border text-center p-1">가격</div>
                <div className="border text-center p-1">재고</div>
                <div className="border text-center p-1">바코드</div>
              </>
            )}
          </div>

          {optionSet.map((option, i) => (
            <div className="grid grid-cols-5 mb-1">
              <button
                className="cursor-pointer text-center text-sm font-mono bg-gray-400  text-white ml-5 rounded-sm"
                onClick={async () =>
                  await db
                    .collection("optionSet")
                    .doc(optionId)
                    .collection("options")
                    .doc(option.id)
                    .delete()
                }
              >
                옵션 삭제
              </button>
              <input
                name="optionName"
                onChange={(e) => handleOptionSet(e, i)}
                value={option.optionName}
                placeholder="이름"
                type="text"
                className="outline-none border p-1 pl-2"
              />
              <input
                name="optionPrice"
                onChange={(e) => handleOptionSet(e, i)}
                value={option.optionPrice}
                placeholder="가격"
                type="number"
                className="outline-none border p-1 pr-2 text-right"
              />
              <input
                name="optionStock"
                onChange={(e) => handleOptionSet(e, i)}
                value={option.optionStock}
                placeholder="재고"
                type="number"
                className="outline-none border p-1 pr-2 text-right"
              />
              <input
                name="optionBarcode"
                onChange={(e) => handleOptionSet(e, i)}
                value={option.optionBarcode}
                placeholder="바코드"
                type="text"
                className="outline-none border p-1 pr-2 text-right"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
