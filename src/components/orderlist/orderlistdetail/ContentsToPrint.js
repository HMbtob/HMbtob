import React, { Component } from "react";

export class ContentsToPrint extends Component {
  render() {
    return (
      <div className="m-auto mt-10 w-11/12 ">
        <div className="">
          <div className="text-center text-xl">
            Pick Up List ({this.props.nickName}) ({this.props.today})
          </div>

          <div
            className="grid grid-cols-20 border text-center
             bg-gray-700 text-white"
          >
            <div className="col-span-1">no.</div>
            <div className="col-span-3">bar</div>
            <div className="col-span-3">sku</div>
            <div className="col-span-8">title</div>
            <div className="col-span-4">memo</div>
            <div className="col-span-1">qty</div>
          </div>

          {this.props.pickUpLists &&
            this.props.pickUpLists.map((list, i) => (
              <div
                key={i}
                className="grid grid-cols-20 border-b
               border-r border-l text-sm p-1"
              >
                <div className="col-span-1 text-center">{i + 1}</div>
                <div className="col-span-3 text-center">{list.barcode}</div>
                <div className="col-span-3 text-center">{list.sku}</div>
                <div className="col-span-8 text-left">{list.title}</div>
                <div className="col-span-4">{list.memo}</div>
                <div className="col-span-1 text-center">{list.quan}</div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
