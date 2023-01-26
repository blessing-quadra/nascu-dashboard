import { Button, Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { DateInput, TextInput } from "../../Components/Input/Input";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function EmployeeOverlay(props) {
  const [recurrentDateValueBackup, setRecurrentDateValueBackup] = useState(
    props.data.recurringDayOfMonth
  );
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(0);
    }
  };
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        <div className="p-4">
          <h4 className="text-lg font-semibold pt-5 pb-4">
            Add new employee to schedule
          </h4>

          {/* Single adding of employee */}
          <>
            <TextInput
              label={"Amount"}
              value={props.data.amount}
              type={"number"}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  amount: e.target.value,
                })
              }
              className="w-full"
            />
            <TextInput
              label={"Employee Number"}
              value={props.data.employeeNumber}
              type={"text"}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  employeeNumber: e.target.value,
                })
              }
              className="w-full"
            />
          </>

          <Button onClick={props.addEmployeeHandler} style={styles.registerBtn}>
            Add employee
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeOverlay;
