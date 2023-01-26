import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoginBtn } from "../../Components/Button/Button";
import { TextInput } from "../../Components/Input/Input";
import { BuyAirtimeService } from "../../Services/Utility/Utility";

const styles = {
  buyUtilityBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 16px",
  },
};

function BuyAirtime() {
  const [airtimeData, setAirtimeData] = useState({
    amount: {
      amount: "100",
      currencyCode: "GMD",
    },
    serviceProviderUsername: "gamswitch",
    serviceProviderAccountNumber: JSON.parse(
      sessionStorage.getItem("mobileNumber")
    ),
    additionalInformation: {
      PAYMENT_OPERATION_TYPE: "AIRTIME",
      COUNTRY: "GMB",
    },
  });

  const buyAirtimeHandler = () => {
    // alert(JSON.stringify(airtimeData));
    const promise = BuyAirtimeService(airtimeData);
    toast.promise(promise, {
      loading: "Authenticating...",
      success: "",
      error: "",
    });
    promise
      .then((response) => {
        const { responseDescription } = response.data;
        toast.promise(promise, {
          success: responseDescription,
        });
      })
      .catch((error) => {
        if (error?.response) {
          const { status } = error?.response;
          if (status === 400) {
            toast.error("Bad request. Check and retry.");
          } else if (status === 404) {
            toast.error("Resources not available.");
          } else if (status === 500) {
            toast.error(error?.response?.data?.responseBody?.errorDescription);
          } else {
            toast.error("Error occured. Try again");
          }
        } else {
          toast.error(error.message);
        }
      });
  };

  return (
    <div className="airtime-form w-full flex flex-col items-start sm:px-28">
      <h4 className="text-xl font-medium">Buy airtime</h4>
      <TextInput
        value={airtimeData.amount.amount}
        type={"amount"}
        onChange={(e) =>
          setAirtimeData({
            ...airtimeData,
            amount: {
              ...airtimeData.amount,
              amount: e.target.value,
            },
          })
        }
        label={"Airtime amount"}
        className="w-full"
      />
      <TextInput
        value={airtimeData.serviceProviderAccountNumber}
        type={"number"}
        onChange={(e) =>
          setAirtimeData({
            ...airtimeData,
            serviceProviderAccountNumber: e.target.value,
          })
        }
        label={"Beneficiary number"}
        className="w-full"
      />
      <LoginBtn
        onClick={buyAirtimeHandler}
        style={styles.buyUtilityBtn}
        text={"Buy airtime"}
      />
    </div>
  );
}

export default BuyAirtime;
