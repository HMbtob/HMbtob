import React, { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";
import { toDate } from "../../utils/shippingUtils";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

export function OrderListPie({ orders }) {
  const today = new Date();
  const todaySub = today.toISOString().substring(0, 10);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      {
        name: "Confirmed",
        value: orders?.filter(order => order?.data?.confirmed === true)?.length,
      },
      {
        name: "Canceled",
        value: orders?.filter(order => order?.data?.canceled === true)?.length,
      },
      {
        name: "Unconfirmed",
        value: orders?.filter(order => order?.data?.confirmed !== true)?.length,
      },
      {
        name: "Todays",
        value: orders?.filter(
          order => toDate(order?.data?.createdAt?.seconds) === todaySub
        )?.length,
      },
    ]);
  }, [orders, todaySub]);

  return (
    <PieChart width={400} height={400} className="text-center">
      {console.log(
        "Confirmed",
        orders?.filter(order => order?.data?.confirmed === true)?.length
      )}
      {console.log(
        "Canceled",
        orders?.filter(order => order?.data?.canceled === true)?.length
      )}
      {console.log(
        "Unconfirmed",
        orders?.filter(order => order?.data?.confirmed !== true)?.length
      )}
      {console.log(
        "Todays",
        orders?.filter(
          order => toDate(order?.data?.createdAt?.seconds) === todaySub
        )?.length
      )}
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        label
      />
    </PieChart>
  );
}
