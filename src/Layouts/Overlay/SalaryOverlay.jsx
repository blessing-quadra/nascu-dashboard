import { Button, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
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

function SalaryOverlay(props) {
  const [checked, setChecked] = React.useState(true);
  const [recurrentDateValueBackup, setRecurrentDateValueBackup] =
    React.useState(props.data.recurringDayOfMonth);

  // props.setData({
  //   ...props.data,
  //   recurringDayOfMonth: e.target.value,
  // })

  const handleChange = (event) => {
    setChecked(event.target.checked);
    // If checkbox is false, backup its value, and set the form state to null
    if (!event.target.checked) {
      setRecurrentDateValueBackup(props.data.recurringDayOfMonth);
      props.setData({
        ...props.data,
        recurringDayOfMonth: null,
      });
    }else{
      // If checkbox is true, set the form state to backup value
      props.setData({
        ...props.data,
        recurringDayOfMonth: recurrentDateValueBackup,
      });
    }
    //
  };
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
            Create a new salary schedule
          </h4>

          <DateInput
            label="Salary month & Year"
            value={props.data.date}
            onChange={(e) =>
              props.setData({
                ...props.data,
                date: e.target.value,
              })
            }
          />
          <TextInput
            label={"Description"}
            value={props.data.description}
            type={"text"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                description: e.target.value,
              })
            }
            className="w-full"
          />

          <div className="w-full h-12">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Automate salary as recurrent"
            />
          </div>

          {checked && (
            <TextInput
              label={"Day of the month"}
              value={props.data.recurringDayOfMonth}
              type={"number"}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  recurringDayOfMonth: e.target.value,
                })
              }
              className="w-full"
            />
          )}

          <Button onClick={props.scheduleSalary} style={styles.registerBtn}>
            Schedule Salary
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SalaryOverlay;
