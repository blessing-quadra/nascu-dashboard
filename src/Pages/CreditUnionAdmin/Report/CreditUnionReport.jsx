import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import ReportCard from "../../../Components/Card/ReportCard";
import Navbar from "../../../Layouts/Navbar/Navbar";
import RightSidebar from "../../../Layouts/RightSidebar/RightSidebar";
import BranchOfficerSidebar from "../../../Layouts/Sidebar/Sidebar";
import CreditUnionReportTable from "../../../Layouts/Table/CreditUnionReportTable";
import { FetchReportForCU } from "../../../Services/Reporting/Reporting";
import { useParams, useNavigate } from "react-router";
import { SVGS } from "../../../Assets";

function CreditUnionReport() {
  const params = useParams();
  const navigateTo = useNavigate();
  const [moreDetailsProp, setMoreDetailsProp] = useState("");
  const [fromDate, setFromDate] = useState("2022-01-01");
  const [toDate, setToDate] = useState("2022-01-01");
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState("NASCUMetrics");
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
    const currentDate = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    setToDate(currentDate);
    setFromDate(currentDate);
  }, [fromDate]);

  useEffect(() => {
    const organizationId = params.id;
    FetchCUReporting(organizationId);
  }, []);

  const FetchReporting = async (organizationId) => {
    const response = await FetchReportForBO(organizationId);
    // const reportingDataResp = response.responseBody.contents
    //   ? [response.responseBody.contents]
    //   : [];
    const reportingDataResp = response.data;
    setData(reportingDataResp);
  };

  const FetchCUReporting = async (organizationId) => {
    const response = await FetchReportForCU();
    // const reportingDataResp = response.responseBody.contents
    //   ? [response.responseBody.contents]
    //   : [];
    const reportingDataResp = response.data;
    const _metrics = Object.keys(reportingDataResp.metrics).map((key) => {
      return {
        name: key.split("_").join(" "),
        value: reportingDataResp.metrics[key],
      };
    });
    setMetrics(_metrics);
    const _data = reportingDataResp.credit_unions.map((prop, index) => ({
      ...prop,
      id: index,
    }));
    setData(_data);
  };

  const changeDate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "fromDate") {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  };
  const viewMoreHandler = (name) => {
    setMoreDetailsProp(name);
  };
  const goBackHandler = () => {
    navigateTo(-1);
  }
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
              <div className="flex items-center gap-2">
                <button onClick={goBackHandler} className="flex items-center gap-1 text-md border-2 border-gray-500 p-2 rounded-lg">
                  <SVGS.BackIcon /> Back
                </button>
                <h4 className="text-2xl font-semibold">
                  Credit Union Reporting
                </h4>
              </div>
              <hr className="w-full mt-4" />
            </div>
            <div className="tab-header pt-4 flex items-center justify-between gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveTab("NASCUMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "NASCUMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  NASCU Report
                </button>
                <button
                  onClick={() => {
                    setActiveTab("creditUnionMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "creditUnionMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Credit Unions Report
                </button>
                <button
                  onClick={() => {
                    setActiveTab("branchOfficerMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "branchOfficerMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Branch Officers Report
                </button>
                <button
                  onClick={() => {
                    setActiveTab("agentMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "agentMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Agents Report
                </button>
                <button
                  onClick={() => {
                    setActiveTab("memberMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "memberMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Members Reports
                </button>
                <button
                  onClick={() => {
                    setActiveTab("financialMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "financialMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Financial Reports
                </button>
                <button
                  onClick={() => {
                    setActiveTab("membershipMetrics");
                    setMoreDetailsProp("");
                  }}
                  className={`transition-all duration-700 text-sm py-3 px-4 border border-gray-200 rounded-lg ${
                    activeTab === "membershipMetrics"
                      ? "bg-primary-theme text-white"
                      : "text-primary-theme bg-white"
                  }`}
                >
                  Membership Reports
                </button>
              </div>
              {/* <div>
                <p className="text-yellow-800 bg-yellow-50 text-sm">
                  Select date range here if you wish to filter by date range
                </p>
                <div className="gap-2 flex items-center">
                  <TextInput
                    label="from"
                    type="date"
                    defaultValue={fromDate}
                    name="fromDate"
                    onChange={changeDate}
                  />
                  <TextInput
                    label="to"
                    type="date"
                    defaultValue={toDate}
                    name="toDate"
                    onChange={changeDate}
                  />
                </div>
              </div> */}
            </div>
            <div className="w-full h-32 grid grid-cols-5 gap-4 my-4">
              {metrics.map(({ name, value }) => (
                <ReportCard
                  isActive={moreDetailsProp === name}
                  viewMoreHandler={viewMoreHandler}
                  name={name}
                  value={value}
                  isDetailsAvailable={false}
                />
              ))}
            </div>
            <div className="w-full">
              <CreditUnionReportTable data={data} />
              {moreDetailsProp && (
                <div className="preload flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-gray-600 border-t-transparent animate-spin"></div>
                  <p className="text-sm text-gray-600">
                    Fetching {moreDetailsProp} from {fromDate} to {toDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default CreditUnionReport;
