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
};

function SuccessOverlay(props) {
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
            {props.depositInfo.message}
          </h4>

          <p className="text-sm text-gray-400">Reference Number</p>
          <h5 onClick={()=>{
            window.navigator.clipboard.writeText(props.depositInfo.reference);
            toast.success("Reference ID copied")
          }} className="font-medium text-black flex items-center">{props.depositInfo.reference} <span className="mx-2 bg-gray-200 flex text-primary-theme px-3 py-1 rounded text-xs">copy</span></h5>

          <p className="text-sm text-gray-400 mt-4">Transaction Number</p>
          <h5 className="font-medium text-black mb-4">{props.depositInfo.transactionId}</h5>

          <Button
            onClick={() => window.location.reload()}
            style={styles.registerBtn}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessOverlay;
