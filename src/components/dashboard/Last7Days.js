import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  }
}

export function Last7Days({ orders }) {
  const data = [
    ...new Set(
      orders
        // .sort((a, b) => {
        //   return a?.title?.trim() < b?.title?.trim()
        //     ? -1
        //     : a?.title?.trim() > b?.title?.trim()
        //     ? 1
        //     : 0;
        // })
        .filter((order) => {
          let today = new Date().getTime();
          let gap = new Date(order.createdAt.seconds * 1000).getTime() - today;
          let day = Math.ceil(gap / (1000 * 60 * 60 * 24));
          return day > -8;
        })
        .map((li) => li.title.trim())
    ),
  ]
    .reduce((a, c) => {
      a.push(
        orders
          .filter((li) => li.title.trim() === c.trim())
          .reduce(
            (a, c) => {
              return {
                title: c.title.trim(),
                quan: Number(a.quan) + Number(c.quan),
              };
            },
            { title: "", quan: 0 }
          )
      );
      return a;
    }, [])
    .sort((a, b) => {
      return a.quan < b.quan ? 1 : -1;
    })
    .slice(0, 30)
    .sort((a, b) => {
      return a.title < b.title ? 1 : -1;
    });

  return (
    <div className="flex flex-col w-full items-center mt-12">
      <div className="text-xl font-semibold">
        최근 7일간 상품별 판매량 TOP 30
      </div>

      <LineChart
        width={1000}
        height={300}
        data={data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="title" />
        <YAxis />
        <Tooltip />
        <Line
          dot={false}
          type="monotone"
          dataKey="quan"
          stroke="#8884d8"
          fill="#8884d8"
          label={<CustomizedLabel />}
        />
      </LineChart>
    </div>
  );
}
