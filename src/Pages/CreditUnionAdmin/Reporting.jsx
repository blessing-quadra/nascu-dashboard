import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { SVGS } from "../../Assets";
import Navbar from "../../Layouts/Navbar/Navbar";
import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";

function Reporting() {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

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
          <div className="pt-16 sm:pt-5">
            <div className="header w-full">
              <h4 className="text-2xl font-semibold">
                {" "}
                Reporting for{" "}
                {JSON.parse(sessionStorage.getItem("selectedScope")).name}
              </h4>
              <p className="text-sm">
                Click on either (Transaction Report) or (Membership Report) card
                below to view more infomation about this credit unions
                transactions and membership report.
              </p>
              <hr className="w-full mt-4" />
            </div>
            <div className="flex items-center gap-4 py-4">
              <Link
                to={"/credit-union-admin/reporting/transactions"}
                // onClick={showDetails}
                className="w-full cursor-pointer transition-all duration-700 hover:border-gray-200 hover:shadow-lg h-auto bg-white hover:bg-gray-100 border border-gray-100 flex flex-col items-center justify-center gap-2 rounded-lg shadow p-4"
              >
                <SVGS.DepositIcon />
                {/* <h5 className="text-2xl font-semibold">-</h5> */}
                <p className="text-sm text-center">Transaction Report</p>
              </Link>
              <Link
                to={"/credit-union-admin/reporting/members"}
                // onClick={showDetails}
                className="w-full cursor-pointer transition-all duration-700 hover:border-gray-200 hover:shadow-lg h-auto bg-white hover:bg-gray-100 border border-gray-100 flex flex-col items-center justify-center gap-2 rounded-lg shadow p-4"
              >
                <SVGS.DepositIcon />
                {/* <h5 className="text-2xl font-semibold">0</h5> */}
                <p className="text-sm text-center">Membership Report</p>
              </Link>
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Reporting;
