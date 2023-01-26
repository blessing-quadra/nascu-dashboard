import React from "react";
import { CartesianGrid,Legend, Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

function BarGraph({data}) {
  return (
    <BarChart width={900} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="cashout" fill="#8884d8" />
      <Bar dataKey="deposit" fill="#82ca9d" />
    </BarChart>
  );
}

export default BarGraph;
