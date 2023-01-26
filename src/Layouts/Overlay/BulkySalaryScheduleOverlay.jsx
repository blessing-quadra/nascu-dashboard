import { Button } from "@mui/material";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { TextInput } from "../../Components/Input/Input";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function BulkySalaryScheduleOverlay(props) {
    const salaryFileRef = useRef();
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(0);
    }
  };
  const uploadFile = (e) => {
    const file = e.target.files[0];
    props.setSalaryFileUploaded(file);
  }
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        <div className="p-4">
          <h4 className="text-lg font-semibold pt-5">
            Bulk Salary Schedule
          </h4>
          <p className="text-sm text-gray-400">Upload CSV/EXCEL sheet containing salary details</p>

         
          <TextInput
            value={props.bulkyPayload.name}
            type={"text"}
            onChange={(e) =>
              props.setBulkyPayload({
                ...props.bulkyPayload,
                name: e.target.value,
              })
            }
            label={"Name"}
            className="w-full"
          />
          <TextInput
            value={props.bulkyPayload.description}
            type={"text"}
            onChange={(e) =>
              props.setBulkyPayload({
                ...props.bulkyPayload,
                description: e.target.value,
              })
            }
            label={"Description"}
            className="w-full"
          />
          <TextInput
            value={props.bulkyPayload.paymentDate}
            type={"date"}
            onChange={(e) =>
              props.setBulkyPayload({
                ...props.bulkyPayload,
                paymentDate: e.target.value,
              })
            }
            label={"Payment Date"}
            className="w-full"
          />
          <p className="text sm">Choose employee file</p>
           <TextInput
            type={"file"}
            onChange={uploadFile}
            label={""}
            className="w-full"
          />

          <Button
            onClick={props.createBulkSchedule}
            style={styles.registerBtn}
            className="w-44"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BulkySalaryScheduleOverlay;
