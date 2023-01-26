import React from "react";
import { CartesianGrid,Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

function LineGraph({data}) {
  return (
    <LineChart
      width={900}
      height={250}
      data={data}
      // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="cashout" stroke="#8884d8" />
      <Line type="monotone" dataKey="deposit" stroke="#82ca9d" />
      {/* <Line type="amount" dataKey="deposit" stroke="#82ca9d" /> */}
    </LineChart>
  );
}

export default LineGraph;
