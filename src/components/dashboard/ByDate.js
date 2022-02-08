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

export function ByDate({ byDate }) {
  return (
    <div className="flex flex-col w-full items-center mt-12">
      <div className="text-xl font-semibold">일별 판매량</div>

      <LineChart
        width={900}
        height={300}
        data={byDate}
        syncId="anyId"
        margin={{
          top: 10,
          right: 0,
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
