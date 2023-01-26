import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoginBtn } from "../../Components/Button/Button";
import { TextInput } from "../../Components/Input/Input";
import { BuyElectricityService } from "../../Services/Utility/Utility";

const styles = {
  buyUtilityBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 16px",
  },
};

function Electricity() {
  const [electricityData, setElectricityData] = useState({
    amount: {
      amount: 100,
      currencyCode: "GMD",
    },
    serviceProviderUsername: "gamswitch",
    serviceProviderAccountNumber: "07164822632",
    additionalInformation: {
      PAYMENT_OPERATION_TYPE: "ELECTRICITY",
      COUNTRY: "GMB",
      PAYEE_MSISDN: "2209567888",
    },
  });

  const buyElectricityHandler = () => {
    const promise = BuyElectricityService(electricityData);
    toast.promise(promise, {
      loading: "Payment processing...",
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
    <div className="airtime-form flex flex-col items-start sm:px-28">
      <h4 className="text-xl font-medium">Electricity</h4>
      <TextInput
        value={electricityData.amount.amount}
        type={"number"}
        onChange={(e) =>
          setElectricityData({
            ...electricityData,
            amount: {
              ...electricityData.amount,
              amount: e.target.value,
            },
          })
        }
        label={"Electricity amount"}
        className="w-full"
      />
      <TextInput
        value={electricityData.serviceProviderAccountNumber}
        type={"number"}
        onChange={(e) =>
          setElectricityData({
            ...electricityData,
            serviceProviderAccountNumber: e.target.value,
          })
        }
        label={"Meter number"}
        className="w-full"
      />
      <TextInput
        value={electricityData.additionalInformation.PAYEE_MSISDN}
        type={"number"}
        onChange={(e) =>
          setElectricityData({
            ...electricityData,
            additionalInformation: {
              ...electricityData.additionalInformation,
              PAYEE_MSISDN: e.target.value,
            },
          })
        }
        label={"Mobile number"}
        className="w-full"
      />
      <LoginBtn
        onClick={buyElectricityHandler}
        style={styles.buyUtilityBtn}
        text={"Buy Electricity"}
      />
    </div>
  );
}

export default Electricity;
