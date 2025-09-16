import { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RevenueData } from "../../types";

type Props = {
  data?: RevenueData[];
};

const RevenueLineChart: FC<Props> = ({ data }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        fontSize: "12px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            stroke="#000"
          />
          <YAxis stroke="#000" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              color: "#000",
            }}
            labelFormatter={(d) => new Date(d).toDateString()}
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ r: 4, fill: "#7c3aed" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
