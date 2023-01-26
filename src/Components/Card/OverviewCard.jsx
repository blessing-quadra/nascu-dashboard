import React from "react";

function OverviewCard(props) {
  return (
    <div className="w-full h-44 bg-white hover:bg-gray-100 border border-gray-100 flex flex-col items-center justify-center gap-2 rounded-lg shadow p-4">
      {props.icon}
      <h5 className="text-2xl font-semibold">{props.value}</h5>
      <p className="text-sm text-center">{props.text}</p>
    </div>
  );
}

export default OverviewCard;
