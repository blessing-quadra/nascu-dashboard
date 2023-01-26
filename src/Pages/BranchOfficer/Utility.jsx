import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import BuyAirtime from "../../Layouts/Utility/Airtime";
import Electricity from "../../Layouts/Utility/Electricity";
import Navbar from "../../Layouts/Navbar/Navbar";

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
  
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const utilityServices = [
    { id: 1, text: "Buy Airtime" },
    { id: 2, text: "Pay for Electricity" },
  ];

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }
  }, []);

  return (
    <div className="flex relative">
      <Toaster position="top-center" />

      <BranchOfficerSidebar
        isLeftSidebarVisible={isLeftSidebarVisible}
        setIsLeftSidebarVisible={setIsLeftSidebarVisible}
      />
      <div className="w-full sm:w-[calc(100%_-_230px)] flex items-start h-screen bg-white">
        <Navbar
          setIsLeftSidebarVisible={setIsLeftSidebarVisible}
          setIsRightSidebarVisible={setIsRightSidebarVisible}
        />
        <div className="middle-content w-full sm:w-[calc(100%_-_240px)] p-6">
          <div className="py-5 pt-16">
            <h4 className="text-2xl font-semibold">Utility</h4>
          </div>
          <div className="flex flex-col sm:flex-row pt-8 gap-4">
            <div className="w-[250px] h-auto">
              {utilityServices.map(({ id, text }) => (
                <Button
                  key={id}
                  onClick={() => setUtilityTab(id)}
                  className="w-full h-14"
                  style={
                    utilityTab === id
                      ? styles.borderBtnerActive
                      : styles.borderBtn
                  }
                >
                  {text}
                </Button>
              ))}
            </div>
            <div className="w-full sm:w-[calc(100%_-_250px)]">
              {utilityTab === 1 && <BuyAirtime />}
              {utilityTab === 2 && <Electricity />}
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Transaction;
