import { FormControl, InputLabel, MenuItem } from "@mui/material";
import React, { useState } from "react";
import Select from "react-select";

function CustomSelect(props) {
  const [selectedOption, setSelectedOption] = useState([]);

  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);
    props.onChange(selectedOptions);
  };
  return (
    <div className="custom-select">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={props.options}
        placeholder={props.placeholder}
        isMulti
      />
    </div>
  );
}

export default CustomSelect;
