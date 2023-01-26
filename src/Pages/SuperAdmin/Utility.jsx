import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/BranchOfficerSidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Avatar, Button } from "@mui/material";
import CompleteCashoutOverlay from "../../Layouts/Overlay/CompleteCashoutOverlay";
import CashoutOverlay from "../../Layouts/Overlay/CashoutOverlay";
import {
  CashoutService,
  CompleteCashoutService,
} from "../../Services/Cashout/CashoutService";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { RefreshToken } from "../../Services/Auth/Refresh";
import { TextInput } from "../../Components/Input/Input";
import BuyAirtime from "../../Layouts/Utility/Airtime";
import Electricity from "../../Layouts/Utility/Electricity";

// import UserCard from "../../Components/Card/UserCard";

const styles = {
  registerBtn: {
    backgroundColor: "#0F5499",
    color: "#FFFFFF",
    padding: "12px 20px",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  borderBtn: {
    // backgroundColor: "#ffffff",
    color: "#0F5499",
    border: "1px solid #0F5499",
    fontWeight: "400",
    textTransform: "capitalize",
    margin: "4px 0",
  },
  borderBtnerActive: {
    backgroundColor: "#0F5499",
    color: "#ffffff",
    border: "1px solid #0F5499",
    fontWeight: "400",
    textTransform: "capitalize",
    margin: "4px 0",
  },
};
function Transaction() {
  const [utilityTab, setUtilityTab] = useState(1);
  const utilityServices = [
    { id: 1, text: "Buy Airtime" },
    { id: 2, text: "Pay for Electricity" },
  ];
  return (
    <div className="flex relative">
      <Toaster position="top-center" />

      <BranchOfficerSidebar />
      <div className="w-[calc(100%_-_205px)] flex items-start h-screen bg-white">
        <div className="middle-content w-[calc(100%_-_300px)] p-6">
          <div className="py-5">
            <h4 className="text-2xl font-semibold">Utility</h4>
          </div>
          <div className="flex pt-8 gap-4">
            <div className="w-[250px] h-auto">
              {utilityServices.map(({ id, text }) => (
                <Button
                  key={id}
                  onClick={() => setUtilityTab(id)}
                  className="w-full h-14"
                  style={utilityTab === id ? styles.borderBtnerActive : styles.borderBtn}
                >
                  {text}
                </Button>
              ))}
            </div>
            <div className="w-[calc(100%_-_250px)]">
              {utilityTab === 1 && <BuyAirtime />}
              {utilityTab === 2 && <Electricity />}
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default Transaction;
