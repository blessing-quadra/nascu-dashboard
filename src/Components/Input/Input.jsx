import { TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import { SVGS } from "../../Assets";

export const TextInput = (props, { styles }) => {
  return (
    <div className="w-full py-4">
      <TextField {...props} styles={styles} />
    </div>
  );
};

export const PasswordInput = (props, { styles }) => {
  const [inputType, setInputType] = useState("password");
  const toggleInputType = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };
  return (
    <div className="w-full py-4 relative">
      <TextField {...props} styles={styles} type={inputType} />
      <span title="toggle password visibility" className="flex w-6 cursor-pointer absolute right-4 top-7" onClick={toggleInputType}>
        <SVGS.EyeIcon color={inputType === "password" ? "#BBBBBB" : "333333"} />
      </span>
    </div>
  );
};


export const DateInput = (props, { styles }) => {
  return (
    <div className="w-full py-4 flex flex-col">
      <label htmlFor="month" className="mb-4">{props.label}</label>
      <input type="month" className="w-48 h-14 px-3 text-gray-500 outline-blue-500 border border-gray-200 rounded" {...props}/>
    </div>
  );
};