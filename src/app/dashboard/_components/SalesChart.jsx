"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { salesData } from "./dashboard-data";

export default function SalesChart() {
  const [range, setRange] = useState("week");
  const data = salesData[range];

  return (
    <article className="rounded-2xl border border-[#e9e8e2] bg-white p-5 shadow-[0_2px_12px_rgba(39,51,45,0.025)] sm:p-6">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#89928c]">Sales performance</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#28332f]">
              {data.total}
            </h2>
            <span className="text-[11px] font-bold text-[#4c8460]">
              ↑ {data.change}
            </span>
          </div>
        </div>
        <label className="sr-only" htmlFor="sales-range">Sales chart range</label>
        <select
          id="sales-range"
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="h-9 rounded-lg border border-[#e9e8e2] bg-white px-3 text-xs font-semibold text-[#69756e] outline-none focus:border-[#789582]"
        >
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>
      <div className="flex h-52 items-end justify-between gap-2 border-b border-[#edede8] px-1 sm:gap-4">
        {data.bars.map(({ day, height }, index) => (
          <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <motion.div
              key={`${range}-${day}`}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className={`w-full max-w-12 rounded-t-lg ${
                index === data.bars.length - 1
                  ? "bg-[#486c5a]"
                  : "bg-[#dce8df] hover:bg-[#b9cebf]"
              } transition-colors`}
              title={`${day}: sample sales`}
            />
            <span className="mb-2 text-[10px] font-medium text-[#99a19b]">
              {day}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-[#9aa19c]">
        <span>Sales activity · {data.label.toLowerCase()}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-[#486c5a]" />
          Sample sales
        </span>
      </div>
    </article>
  );
}
