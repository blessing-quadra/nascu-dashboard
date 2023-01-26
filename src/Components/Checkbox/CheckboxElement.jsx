import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

function CheckboxElement({
  status,
  roleName,
  selectedPermissionsList,
  setSelectedPermissionsList,
}) {
  const [checked, setChecked] = useState(status);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    // console.log(event.target.checked)
    const _permissionsList = selectedPermissionsList.map(({ name, status }) => {
      if (name === roleName) {
        return {
          name,
          status: event.target.checked,
        };
      } else {
        return {
          name,
          status,
        };
      }
    });
    setSelectedPermissionsList(_permissionsList);
  };
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={roleName}
    />
  );
}

export default CheckboxElement;
