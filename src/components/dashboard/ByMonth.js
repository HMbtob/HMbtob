import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function ByMonth({ orders }) {
  const month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex flex-col w-full items-center mt-12">
      <div className="text-xl font-semibold">월별 판매량</div>
      <LineChart
        width={1500}
        height={300}
        data={month.map(doc => ({
          month: doc + 1,
          totalQty: orders
            .filter(
              order =>
                new Date(order.createdAt.seconds * 1000).getMonth() === doc &&
                order.quan < 10000 &&
                (new Date(orders[0].createdAt.seconds * 1000).getFullYear() ===
                  2021 ||
                  new Date(orders[0].createdAt.seconds * 1000).getFullYear() ===
                    2022)
            )
            .reduce((a, c) => {
              return a + Number(c.quan);
            }, 0),
        }))}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalQty"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </LineChart>
    </div>
  );
}
