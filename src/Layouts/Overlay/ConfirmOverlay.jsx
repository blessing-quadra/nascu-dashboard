import { Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  registerBtn2: {
    backgroundColor: "#DDDDDD",
    color: "#333333",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function ConfirmOverlay(props) {
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
        <div className="px-8 py-12">
          <h4 className="text-lg w-4/5 mx-auto text-center font-semibold pt-5 pb-4">
            Are you sure you want to pay pay all the employee in this schedule?
          </h4>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => props.setShowOverlay(0)}
              style={styles.registerBtn2}
              className="w-full"
            >
              Not yet
            </Button>
            <Button
              onClick={props.salaryPaymentHandler}
              style={styles.registerBtn}
              className="w-full"
            >
              Yes, Pay them all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmOverlay;
