import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function ByUsers({ orders, users }) {
  const [selectedUser, setSelectedUser] = useState("");
  const handleSelectedUser = e => {
    setSelectedUser(e.target.value);
  };
  return (
    <div className="flex flex-col w-full items-center mt-24">
      <div className="text-xl font-semibold">유저별 상품별 판매량</div>
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
          width={2500}
          height={600}
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
                    order.nickName === selectedUser ||
                    order.email === selectedUser
                )
                .filter(li => li.title.trim() === c.trim())
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
          {console.log(
            orders.filter(
              order =>
                order.nickName === selectedUser || order.email === selectedUser
            )
          )}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="quan"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </LineChart>
      )}
    </div>
  );
}
