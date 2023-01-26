import React, { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import CheckboxElement from "./CheckboxElement";


function CheckboxContainer({permissions, selectedRoleIndex, selectedPermissionsList, setSelectedPermissionsList}) {
  useEffect(() => {
    setSelectedPermissionsList(permissions[selectedRoleIndex].permissions);
  }, [])
  
  return (
    <div>
      <FormGroup>
        {
            permissions[selectedRoleIndex].permissions?.map(({name, status}, index)=> (
                <CheckboxElement key={index} roleName={name} status={status} selectedPermissionsList={selectedPermissionsList} setSelectedPermissionsList={setSelectedPermissionsList} />
            ))
        }
      </FormGroup>
    </div>
  );
}

export default CheckboxContainer;
