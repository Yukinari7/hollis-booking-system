"use client";

import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export type RevenuePoint = {
  month: string;
  revenue: number;
};

type ChartsProps = {
  data: RevenuePoint[];
};

export function Charts({ data }: ChartsProps) {
  return (
    <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value) => `₦${Number(value) / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`₦${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
            cursor={{ stroke: "#93c5fd", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="transparent"
            fill="url(#revenueGradient)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={3.5}
            dot={{ r: 4.5, fill: "#ffffff", strokeWidth: 2, stroke: "#16a34a" }}
            activeDot={{ r: 7, stroke: "#16a34a", fill: "#ffffff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
