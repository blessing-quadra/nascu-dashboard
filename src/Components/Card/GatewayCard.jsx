import { Button } from "@mui/material";
import React from "react";
import { SVGS } from "../../Assets";

export const GatewayCard = (props) => {
  return (
    <div className="rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-1000">
      <Button
        {...props}
        className="w-[200px] h-36 flex flex-col justify-center items-center"
      >
        <SVGS.SuperAdminIcon />
        <p className="text-sm my-2 uppercase text-black px-4 text-center">
          {props.label}
        </p>
      </Button>
    </div>
  );
};
