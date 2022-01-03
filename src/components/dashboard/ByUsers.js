import React, { PureComponent, useState } from "react";
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
class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

export function ByUsers({ orders, users }) {
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
  const [selectedUser, setSelectedUser] = useState("");
  const handleSelectedUser = e => {
    setSelectedUser(e.target.value);
  };
  return (
    <div className="flex flex-col w-full items-center mt-24">
      <div className="text-xl font-semibold">{"유저별 상품 & 일별 판매량"}</div>
      <select
        value={selectedUser}
        onChange={e => handleSelectedUser(e)}
        className="text-lg py-1 px-2 outline-none"
      >
        <option value={""}>유저를 선택해 주세요</option>
        {users
          .sort((a, b) => {
            return a?.nickName?.trim() < b?.nickName?.trim()
              ? -1
              : a?.nickName?.trim() > b?.nickName?.trim()
              ? 1
              : 0;
          })
          .map((user, i) => (
            <option key={i} value={user.nickName || user.email}>
              {user.nickName || user.email}
            </option>
          ))}
      </select>
      {selectedUser && (
        <LineChart
          width={1500}
          height={300}
          data={[
            ...new Set(
              orders
                .filter(
                  order =>
                    order.nickName === selectedUser ||
                    order.email === selectedUser
                )
                .sort((a, b) => {
                  return a?.title?.trim() < b?.title?.trim()
                    ? -1
                    : a?.title?.trim() > b?.title?.trim()
                    ? 1
                    : 0;
                })
                .map(li => li.title.trim())
            ),
          ].reduce((a, c) => {
            a.push(
              orders
                .filter(
                  order =>
                    (order.nickName === selectedUser ||
                      order.email === selectedUser) &&
                    order.quan < 10000 &&
                    order.title.trim() === c.trim()
                )
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
          }, [])}
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
          />
        </LineChart>
      )}

      {selectedUser && (
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
                nickName: order.nickName,
                monthDate: `${
                  new Date(order.createdAt.seconds * 1000).getMonth() + 1
                }-${new Date(order.createdAt.seconds * 1000).getDate()}`,
                quan: order.quan,
              }))
              .filter(
                f =>
                  f.monthDate === d &&
                  f.quan < 10000 &&
                  (f.nickName === selectedUser || f.email === selectedUser)
              )
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
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="monthDate" tick={<CustomizedAxisTick />} />
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
      )}
    </div>
  );
}
