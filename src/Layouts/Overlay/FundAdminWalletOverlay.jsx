import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
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

function FundAdminWalletOverlay(props) {
  const [walletSelectOptions, setWalletSelectOptions] = useState([]);
  const hideOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      props.setShowOverlay(false);
    }
  };
  useEffect(() => {
    let _walletSelectOptions = [];
    props.wallet.forEach(({ walletType, id }) => {
      _walletSelectOptions.push({
        label: walletType,
        value: id,
      });
    });
    setWalletSelectOptions(_walletSelectOptions);
  }, []);

  // alert(JSON.stringify(walletSelectOptions));
  return (
    <div
      onClick={hideOverlay}
      className="overlay overflow-y-scroll flex items-start justify-center py-6 w-full h-screen bg-[#00000070] fixed top-0 left-0 z-10"
    >
      <div className="w-[550px] h-auto bg-white rounded shadow">
        {JSON.parse(sessionStorage.getItem("selectedScope")).accessType ===
          "CREDIT_UNION_ADMINISTRATOR" && (
          <div className="p-4">
            <h4 className="text-lg font-semibold pt-5 pb-4">
              Fund admin wallet
            </h4>
            <TextInput
              value={props.data.amount}
              type={"number"}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  amount: e.target.value,
                })
              }
              label={"Amount"}
              className="w-full"
            />

            <SelectInput
              className="w-full"
              value={props.data.walletId}
              label={"Wallet ID"}
              options={walletSelectOptions}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  walletId: e.target.value,
                })
              }
            />

            <TextInput
              value={props.data.message}
              onChange={(e) =>
                props.setData({
                  ...props.data,
                  message: e.target.value,
                })
              }
              label={"Message/Description"}
              className="w-full"
            />

            <Button onClick={props.fundAdminWallet} style={styles.registerBtn}>
             Fund main wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FundAdminWalletOverlay;
