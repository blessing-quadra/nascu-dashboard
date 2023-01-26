import { Button } from "@mui/material";
import React from "react";

export const LoginBtn = (props) => {
  return (
    <div className="py-3">
      <Button  {...props} disabled={props.disabled}>{props.text}</Button>
    </div>
  );
};
