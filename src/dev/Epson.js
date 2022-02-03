import React from "react";
import ThermalPrinter from "node-thermal-printer";
import PrinterTypes from "node-thermal-printer";
// const ThermalPrinter = require("./node-thermal-printer").printer;
// const PrinterTypes = require("./node-thermal-printer").types;

export function Epson() {
  const epsonPrint = async () => {
    let printer = new ThermalPrinter.printer({
      type: PrinterTypes.types.EPSON,
      interface: "https://192.168.1.23",
    });
    console.log("printer", printer);
    printer.alignCenter();
    printer.println("Hello world");
    // await printer.printImage("./assets/olaii-logo-black.png");
    printer.cut();
    printer.isPrinterConnected(function (isConnected) {
      console.log(isConnected);
    }); // printer.code128("Code128", {
    //   width: "LARGE", // "SMALL", "MEDIUM", "LARGE",
    //   height: 80, // 50 < x < 80
    //   text: 2, // 1 - No text
    //   // 2 - Text on bottom
    //   // 3 - No text inline
    //   // 4 - Text on bottom inline
    // });
    // try {
    //   let execute = await printer.execute();
    //   console.error("Print done!", execute);
    // } catch (error) {
    //   console.log("Print failed:", error);
    // }
  };

  return <div onClick={() => epsonPrint()}>epson</div>;
}
