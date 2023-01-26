import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

function SelectInput(props) {
  return (
    <FormControl {...props} sx={{ my: 2, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-helper-label">
        {props?.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="select-field"
        value={props.value}
        label={props?.label}
        onChange={props.onChange}
        name={props?.name}
      >
        <MenuItem value={""}>Select</MenuItem>
        {props?.options?.map(({ value, label }, index) => (
          <MenuItem key={index} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectInput;
