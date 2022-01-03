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

export function ByDate({ orders }) {
  const monthDate = [
    ...new Set(
      orders
        ?.sort((a, b) => {
          return a?.createdAt < b?.createdAt
            ? -1
            : a?.createdAt > b?.createdAt
            ? 1
            : 0;
        })
        .map(
          order =>
            `${
              new Date(order.createdAt.seconds * 1000).getMonth() + 1
            }-${new Date(order.createdAt.seconds * 1000).getDate()}`
        )
    ),
  ];

  return (
    <div className="flex flex-col w-full items-center mt-12">
      <div className="text-xl font-semibold">일별 판매량</div>

      <LineChart
        width={1500}
        height={300}
        data={monthDate.map(d =>
          orders
            ?.sort((a, b) => {
              return a?.createdAt < b?.createdAt
                ? -1
                : a?.createdAt > b?.createdAt
                ? 1
                : 0;
            })
            .map(order => ({
              monthDate: `${
                new Date(order.createdAt.seconds * 1000).getMonth() + 1
              }-${new Date(order.createdAt.seconds * 1000).getDate()}`,
              quan: order.quan,
            }))
            .filter(f => f.monthDate === d && f.quan < 10000)
            .reduce(
              (a, c) => {
                return {
                  monthDate: c.monthDate,
                  quan: Number(a.quan) + Number(c.quan),
                };
              },
              { monthDate: "", quan: 0 }
            )
        )}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthDate" />
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
