import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";

const ReceiptPrint = () => {
  const today = new Date();
  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.1.23");
  const [printerPort, setPrinterPort] = useState("8043");
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [j, setJ] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState("");

  const ePosDevice = useRef();
  const printer = useRef();

  const STATUS_CONNECTED = "연결됨";

  const connect = () => {
    setConnectionStatus("연결중 ...");

    if (!printerIPAddress) {
      setConnectionStatus("Type the printer IP address");
      return;
    }
    if (!printerPort) {
      setConnectionStatus("Type the printer port");
      return;
    }

    setConnectionStatus("연결중 ...");

    let ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(
      printerIPAddress,
      printerPort,
      data => {
        if (data === "OK" || data === "SSL_CONNECT_OK") {
          ePosDev.createDevice(
            "local_printer",
            ePosDev.DEVICE_TYPE_PRINTER,
            { crypto: false, buffer: false },
            (devobj, retcode) => {
              if (retcode === "OK") {
                printer.current = devobj;
                // printer.timeout = 60000;
                // printer.onreceive = function (res) {
                //   alert(res.success);
                // };
                // printer.oncoveropen = function () {
                //   alert("coveropen");
                // };
                // print();

                setConnectionStatus(STATUS_CONNECTED);
              } else {
                console.log(retcode);
              }
            }
          );
        } else {
          console.log(data);
        }
      },
      { eposprint: true }
    );
  };

  const getBase64 = async url => {
    try {
      let image = await axios.get(
        "https://us-central1-interasiastock.cloudfunctions.net/app/big/getlogobase64",
        { params: { url } }
      );
      return "data:image/jpeg;base64," + image.data;
    } catch (error) {
      console.log(error);
    }
  };
  const [plane] = useState(new Image());
  const [qr] = useState(new Image());

  let draw = async () => {
    const canvas = document.getElementById("canvass");
    const canvas2 = document.getElementById("canvass2");
    const context = canvas.getContext("2d");
    const context2 = canvas2.getContext("2d");
    plane.context = context;
    qr.context = context2;

    plane.onload = drawImage;
    qr.onload = drawImage2;
    plane.src = await getBase64(
      "https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/assets%2Flogo.png?alt=media&token=8edbc484-07b7-43d7-a63f-3d90adbe8ad9"
    );
    qr.src = await getBase64(
      "https://firebasestorage.googleapis.com/v0/b/interasiastock.appspot.com/o/assets%2Fqrr.png?alt=media&token=f751bb03-2fc9-40c4-a920-ea749d4872ec"
    );
  };

  let drawImage = e => {
    e.target.context.drawImage(plane, 0, 0, 350, 80);
  };
  let drawImage2 = e => {
    e.target.context.drawImage(qr, 0, 0, 400, 150);
  };
  useEffect(() => {
    draw();
  });
  const print = async (barcode, title, qty, price) => {
    let prn = printer.current;
    if (!prn) {
      alert("Not connected to printer");
      return;
    }
    let can = document.getElementById("canvass");
    if (can.getContext) {
      let context = can.getContext("2d");
      prn.addImage(context, 0, 0, can.width, can.height);
    }
    prn.addTextLang("ko-kr");
    prn.addText("\n");
    prn.addText(`******************************************`);
    prn.addText("\n");
    prn.addText(`***********영수증 즉시 발행 인쇄**********`);
    prn.addText(`\n`);
    prn.addText(`회사명 : 인터아시아`);
    prn.addText(`\n`);
    prn.addText(`사업자 : 113-86-57123`);
    prn.addText(`\n`);
    prn.addText(`주소 : 서울시 금천구 디지털로10길 78`);
    prn.addText(`\n`);
    prn.addText(`       가산테라타워 417호`);
    prn.addText(`\n`);
    prn.addText(`대표자 : 주성호`);
    prn.addText(`\n`);
    prn.addText(`전화 : 02-3281-0147`);
    prn.addText(`\n`);
    prn.addText(`=====================================`);
    prn.addText(`\n`);
    prn.addText(today.toLocaleString());
    prn.addText(`\n`);
    prn.addText(`상품명           수량    단가    금액`);
    prn.addText(`\n`);
    prn.addText(barcode);
    prn.addText(`       `);
    prn.addText(Number(qty?.toFixed(0)).toLocaleString("ko-kr"));
    prn.addText(`      `);
    prn.addText(Number(price?.toFixed(0)).toLocaleString("ko-kr"));
    prn.addText(`      `);
    prn.addText(Number((qty * price)?.toFixed(0)).toLocaleString("ko-kr"));
    prn.addText(`\n`);
    prn.addText(`*${title}`);
    prn.addText(`\n`);
    prn.addText(`-------------------------------------`);
    prn.addText(`\n`);
    prn.addText(`                  과세물품 : `);
    prn.addText(
      `${Number(((qty * price) / 1.1).toFixed(0)).toLocaleString("ko-kr")}`
    );
    prn.addText(`\n`);
    prn.addText(`                  부 가 세 : `);
    prn.addText(
      `${Number((qty * price - (qty * price) / 1.1).toFixed(0)).toLocaleString(
        "ko-kr"
      )}`
    );
    prn.addText(`\n`);
    prn.addText(`                  합    계 : `);
    prn.addText(`${Number((qty * price).toFixed(0)).toLocaleString("ko-kr")}`);
    prn.addText(`\n`);
    prn.addText(`=====================================`);
    prn.addText(`\n`);
    prn.addText(
      `              결제대상금액 : ${Number(
        (qty * price).toFixed(0)
      ).toLocaleString("ko-KR")}`
    );
    prn.addText(`\n`);
    prn.addText("* 표시 상품은 부가세 과세 품목 입니다. ");
    prn.addText(`\n`);
    prn.addText("   인터아시아는 한터차트 패밀리샵입니다.");
    prn.addText(`\n`);
    prn.addText("        HANTEO CHART FAMILY SHOP");
    prn.addText(`\n`);
    let can2 = document.getElementById("canvass2");
    if (can2.getContext) {
      let context2 = can2.getContext("2d");
      prn.addImage(context2, 50, 0, can2.width, can2.height);
    }
    prn.addText("        https://www.interasia.co.kr/");
    prn.addFeedLine(1);
    prn.addCut(prn.CUT_FEED);
    prn.send();
  };

  const repeat = async (j, barcode, title, qty, price) => {
    for (let i = 0; i < j; i++) {
      await print(barcode, title, qty, price);
    }
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div
        id="thermalPrinter"
        className="mt-24 w-2/3 flex flex-col items-center"
      >
        <div className="w-11/12 bg-gray-800 font-semibold text-white rounded-sm text-center">
          영수증 인쇄
        </div>
        <div className="flex flex-col mt-12">
          <div className="mt-12 flex flex-row justify-between items-center">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-3">
              IP
            </div>
            <input
              className="border py-1 px-2 outline-none"
              id="printerIPAddress"
              placeholder="Printer IP Address"
              value={printerIPAddress}
              onChange={e => setPrinterIPAddress(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row  justify-between items-center">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-3">
              PORT
            </div>
            <input
              className="border py-1 px-2 outline-none"
              id="printerPort"
              placeholder="Printer Port"
              value={printerPort}
              onChange={e => setPrinterPort(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-row items-center">
          <button
            className=" bg-gray-800 font-semibold text-white py-1 px-4"
            disabled={connectionStatus === STATUS_CONNECTED}
            onClick={() => connect()}
          >
            연결하기
          </button>
          <span className="status-label text-center ml-5">
            {connectionStatus}
          </span>
        </div>
        <hr />
        <div className="flex flex-col mt-12">
          <div className="flex flex-row ">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-2">
              인쇄 매수
            </div>
            <input
              className="border py-1 px-2 outline-none"
              type="number"
              value={j}
              onChange={e => setJ(Number(e.currentTarget.value))}
            />
          </div>
          <div className="flex flex-row">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-2">
              바코드
            </div>
            <input
              placeholder="Barcode"
              className="border py-1 px-2 outline-none"
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-2">
              제목
            </div>
            <input
              placeholder="Title"
              className="border py-1 px-2 outline-none"
              type="text"
              value={title}
              onChange={e => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-row">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-2">
              판매 수량
            </div>
            <input
              className="border py-1 px-2 outline-none"
              type="number"
              value={qty}
              onChange={e => setQty(Number(e.currentTarget.value))}
            />
          </div>
          <div className="flex flex-row">
            <div className=" bg-gray-800 text-white font-semibold  w-full text-center py-1 px-2">
              판매가격
            </div>
            <input
              className="border py-1 px-2 outline-none"
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.currentTarget.value))}
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <button
              className=" bg-gray-800 font-semibold text-white py-1 px-4 my-5"
              disabled={connectionStatus !== STATUS_CONNECTED}
              onClick={() => repeat(j, barcode, title, qty, price)}
            >
              인쇄하기
            </button>
            <div className="text-sm">
              (연결 후 하단에 로고, QR코드 로딩완료 후 인쇄)
            </div>
          </div>
        </div>
        <div>
          <canvas id="canvass" height="80" width="350"></canvas>
          <canvas id="canvass2" height="150" width="400"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPrint;
