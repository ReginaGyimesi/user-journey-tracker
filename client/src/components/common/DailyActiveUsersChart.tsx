import { FC } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyActiveUsersData } from "../../types";

type Props = {
  data?: DailyActiveUsersData[];
};

const DailyActiveUsersChart: FC<Props> = ({ data }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 400,
        fontSize: "12px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            formatter={(value: number) => [value, "Active Users"]}
          />
          <Bar dataKey="activeUsers" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyActiveUsersChart;
