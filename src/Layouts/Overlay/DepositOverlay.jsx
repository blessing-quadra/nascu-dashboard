import { Button } from "@mui/material";
import React from "react";
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

function DepositOverlay(props) {
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
        <div className="p-4">
          {JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
            "CREDIT_UNION_ADMINISTRATOR" && (
            <h4 className="text-lg font-semibold pt-5 pb-4">
              Deposit into Branch officer wallet
            </h4>
          )}
          {JSON.parse(sessionStorage.getItem("selectedScope"))?.accessType ===
            "CREDIT_UNION_BRANCH_OFFICER" && (
            <h4 className="text-lg font-semibold pt-5 pb-4">
              Deposit into Credit Union Member Account
            </h4>
          )}
          <TextInput
            value={props.data.mobileNumber}
            type={"number"}
            onChange={(e) =>
              props.setData({
                ...props.data,
                mobileNumber: e.target.value,
              })
            }
            label={"Mobile Number"}
            className="w-full"
          />
          <TextInput
            label={"Amount"}
            type={"number"}
            value={props.data.amount}
            onChange={(e) =>
              props.setData({
                ...props.data,
                amount: e.target.value,
              })
            }
            className="w-full"
          />
          <TextInput
            value={props.data.message}
            onChange={(e) =>
              props.setData({
                ...props.data,
                message: e.target.value,
              })
            }
            label={"Description message"}
            className="w-full"
          />
          <Button onClick={props.depositHandler} style={styles.registerBtn}>
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DepositOverlay;
