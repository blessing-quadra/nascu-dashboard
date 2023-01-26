import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReportCard from "../../../Components/Card/ReportCard";
import Navbar from "../../../Layouts/Navbar/Navbar";
import RightSidebar from "../../../Layouts/RightSidebar/RightSidebar";
import BranchOfficerSidebar from "../../../Layouts/Sidebar/Sidebar";
import {
  FetchReportForBO,
  FetchAllCreditUnionTransactions,
  FetchAllMembers,
} from "../../../Services/Reporting/Reporting";
import { useParams, useNavigate } from "react-router";
import { SVGS } from "../../../Assets";
import CreditUnionReportFilterOverlay from "../../../Layouts/Overlay/CreditUnionReportFilterOverlay";
import MemberUsersTable from "../../../Layouts/Table/SuperAdmin/MemberUsersTable";
import CreditUnionTransactionReportTable from "../../../Layouts/Table/SuperAdmin/CreditUnionTransactionReportTable";
import ExportToCSV from "../../../Components/ExportToCSV/ExportToCSV";

function BranchOfficerReport() {
  const params = useParams();
  const navigateTo = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [payload, setPayload] = useState({
    fromDate: "2022-01-01",
    toDate: "2022-01-01",
    type: "",
  });
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
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

  useState(() => {
    const today = new Date(); //"2017-05-24"
    const year = today.getFullYear();
    const month =
      JSON.stringify(today.getMonth() + 1).length > 1
        ? today.getMonth() + 1
        : "0" + today.getMonth() + 1;
    const day =
      JSON.stringify(today.getDate()).length > 1
        ? today.getDate()
        : "0" + today.getDate();
    const currentDate = `${year}-${month}-${day}`;

    setPayload({
      ...payload,
      toDate: currentDate,
      fromDate: currentDate,
    });
  }, [payload]);

  useEffect(() => {
    const organizationId = params.id;
    FetchBOReporting(organizationId);
  }, []);

  const FetchReporting = async (organizationId) => {
    const response = await FetchReportForBO(organizationId);
    // const reportingDataResp = response.responseBody.contents
    //   ? [response.responseBody.contents]
    //   : [];
    const reportingDataResp = response.data;
    setData(reportingDataResp);
  };

  const FetchBOReporting = async (organizationId) => {
    const response = await FetchReportForBO();
    // const reportingDataResp = response.responseBody.contents
    //   ? [response.responseBody.contents]
    //   : [];
    const reportingDataResp = response.data;
    const _metrics = Object.keys(reportingDataResp.metrics).map((key) => {
      return {
        label: key.split("_").join(" "),
        value: reportingDataResp.metrics[key],
      };
    });
    const _options = Object.keys(reportingDataResp.metrics).map((key) => {
      return {
        label: key.split("_").join(" "),
        value: key,
      };
    });
    setFilterOptions(_options);
    setMetrics(_metrics);
  };

  const FetchMembers = async () => {
    if (payload.fromDate && payload.toDate && payload.type) {
      setIsLoading(true);
      const response = await FetchAllMembers();
      // const reportingDataResp = response.responseBody.contents
      //   ? [response.responseBody.contents]
      //   : [];
      const reportingDataResp = response.data;
      const _data = reportingDataResp.users.map((prop, index) => ({
        ...prop,
        id: index,
      }));
      setData(_data);
      setSelectedCard(payload.type);
      setShowOverlay(false);
      setIsLoading(false);
    } else {
      toast.error("All fields are required");
    }
  };

  const changeFilterProps = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "fromDate") {
      setPayload({
        ...payload,
        fromDate: value,
      });
    } else if (name === "toDate") {
      setPayload({
        ...payload,
        toDate: value,
      });
    } else {
      setPayload({
        ...payload,
        type: value,
      });
    }
  };
  const viewMoreHandler = (label) => {
    setShowOverlay(true);
    setPayload({
      ...payload,
      type: label.split(" ").join("_"),
    });
  };

  const goBackHandler = () => {
    navigateTo(-1);
  };

  const FetchCUTransaction = async () => {
    if (payload.fromDate && payload.toDate && payload.type) {
      setIsLoading(true);
      const response = await FetchAllCreditUnionTransactions();
      // const reportingDataResp = response.responseBody.contents
      //   ? [response.responseBody.contents]
      //   : [];
      const reportingDataResp = response.data;
      const _data = reportingDataResp.transactions.map((prop, index) => ({
        ...prop,
        id: index,
      }));
      setData(_data);
      setSelectedCard(payload.type);
      setShowOverlay(false);
      setIsLoading(false);
    } else {
      toast.error("All fields are required");
    }
  };
  return (
    <div className="flex relative">
      {showOverlay && (
        <CreditUnionReportFilterOverlay
          setShowOverlay={setShowOverlay}
          payload={payload}
          changeFilterProps={changeFilterProps}
          generateReport={
            payload.type === "transaction_volume"
              ? FetchCUTransaction
              : FetchMembers
          }
          filterOptions={filterOptions}
        />
      )}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={goBackHandler}
                  className="flex items-center gap-1 text-md border-2 border-gray-500 p-2 rounded-lg"
                >
                  <SVGS.BackIcon /> Back
                </button>
                <h4 className="text-2xl font-semibold">
                  Branch Officer Reporting
                </h4>
              </div>
              <hr className="w-full mt-4" />
            </div>
            <div className="w-full h-auto grid grid-cols-5 gap-4 my-4">
              {metrics.map(({ label, value }) => (
                <ReportCard
                  isActive={selectedCard === label.split(" ").join("_")}
                  viewMoreHandler={viewMoreHandler}
                  name={label}
                  value={value}
                  isDetailsAvailable={
                    label === "registered members" || label === "active members"
                  }
                />
              ))}
            </div>
            <div className="w-full">
              <ExportToCSV csvData={data ? data : ""}>
                <MemberUsersTable data={data} />
              </ExportToCSV>
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default BranchOfficerReport;
