import { Button } from "@mui/material";
import React from "react";
import { TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
};

function CompleteCashoutOverlay(props) {
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
          "CREDIT_UNION_BRANCH_OFFICER" && (
          <div className="p-4">
            <h4 className="text-lg font-semibold pt-5 pb-4">
              Complete Withdrawal for Credit Union Member
            </h4>
            <TextInput
              value={props.data.reference}
              type={"number"}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  reference: e.target.value,
                })
              }
              label={"Reference Number"}
              className="w-full"
            />

            <SelectInput
              className="w-full"
              value={props.data.cashOutStatus}
              label={"Cashout Status"}
              options={[
                { label: "REDEEMED", value: "REDEEMED" },
                { label: "CANCELLED", value: "CANCELLED" },
              ]}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  cashOutStatus: e.target.value,
                })
              }
            />

            <Button
              onClick={props.completeCashoutHandler}
              style={styles.registerBtn}
            >
              Complete Cashout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompleteCashoutOverlay;
