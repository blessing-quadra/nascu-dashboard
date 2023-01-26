import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Layouts/Navbar/Navbar";
import { FetchReportsForCUAdmin } from "../../Services/Reporting/Reporting";
import SelectInput from "../../Components/Select/Select";

const reportingData = [
  {
    totalNumberOfRegisteredMembers: 2,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "szvYQ6rPvYnbvngdv0Lwa7SOghVMXYoi",
    organizationName: "Ndembalanteh Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 10.0,
    totalTransactionAmount: 10.0,
    totalTransactionVolume: 3,
  },
  {
    totalNumberOfRegisteredMembers: 3,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "vyZn1Q30b30tKzs4jCYiEE4N8gjmNeeD",
    organizationName: "Medical& Health Staff Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 10.0,
    totalTransactionAmount: 10.0,
    totalTransactionVolume: 3,
  },
  {
    totalNumberOfRegisteredMembers: 5,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "Zu6BKNaWXljdYraMCPRuLeLWxMAqN6Gk",
    organizationName: "Police Force Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 0.0,
    totalTransactionAmount: 0.0,
    totalTransactionVolume: 0,
  },
  {
    totalNumberOfRegisteredMembers: 24,
    numberOfActiveMembers: 8,
    totalNumberOfBranchOfficers: 2,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "qdMIYTsDtRHqqCYMuJT7IWVEnZTnCDCn",
    organizationName: "GAMTEL Staff Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: false,
    totalCommissions: 1028.86,
    totalTransactionAmount: 12291.86,
    totalTransactionVolume: 591,
  },
  {
    totalNumberOfRegisteredMembers: 3,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "xFjobeNPjCZoA7ov8wONe8840UX1ZXFQ",
    organizationName: "Nawec Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 20.0,
    totalTransactionAmount: 20.0,
    totalTransactionVolume: 6,
  },
  {
    totalNumberOfRegisteredMembers: 0,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "0finAycSagUwlQpxImEKe86KvND9BU60",
    organizationName: "Teachers Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: false,
    totalCommissions: 0.0,
    totalTransactionAmount: 0.0,
    totalTransactionVolume: 0,
  },
  {
    totalNumberOfRegisteredMembers: 0,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "LFjUannXjfoIy52OMNSjJURrdIXe4a6b",
    organizationName: "Catholic Secretariat Cooperative Credit Union (CECCU)",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 0.0,
    totalTransactionAmount: 0.0,
    totalTransactionVolume: 0,
  },
  {
    totalNumberOfRegisteredMembers: 0,
    numberOfActiveMembers: 0,
    totalNumberOfBranchOfficers: 0,
    numberOfActiveBranchOfficers: 0,
    totalNumberOfAgents: 0,
    numberOfActiveAgents: 0,
    organizationId: "jckVzfVpLANrdXRAr5f0yV07upUnP3eF",
    organizationName: "Sofora Cooperative Credit Union",
    organizationType: "CREDIT_UNION",
    isOrganizationActive: true,
    totalCommissions: 0.0,
    totalTransactionAmount: 0.0,
    totalTransactionVolume: 0,
  },
];

const filterOptions = [
  {
    label: "Number of registered members",
    value: "totalNumberOfRegisteredMembers",
  },
  { label: "Number of active members", value: "numberOfActiveMembers" },
  { label: "Transaction Volume", value: "totalTransactionVolume" },
  { label: "Transaction Amount", value: "totalTransactionAmount" },
];
function Reporting() {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [reportFilter, setReportFilter] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    const compareFunc = (start, end) => {
      switch (reportFilter) {
        case "totalNumberOfRegisteredMembers":
          if (
            start.metrics.totalNumberOfRegisteredMembers >
            end.metrics.totalNumberOfRegisteredMembers
          ) {
            return -1;
          } else if (
            start.metrics.totalNumberOfRegisteredMembers <
            end.metrics.totalNumberOfRegisteredMembers
          ) {
            return 1;
          }
          return 0;
          break;

        case "totalTransactionVolume":
          if (
            start.metrics.totalTransactionVolume >
            end.metrics.totalTransactionVolume
          ) {
            return -1;
          } else if (
            start.metrics.totalTransactionVolume <
            end.metrics.totalTransactionVolume
          ) {
            return 1;
          }
          return 0;
          break;

        case "totalTransactionAmount":
          if (
            start.metrics.totalTransactionAmount >
            end.metrics.totalTransactionAmount
          ) {
            return -1;
          } else if (
            start.metrics.totalTransactionAmount <
            end.metrics.totalTransactionAmount
          ) {
            return 1;
          }
          return 0;
          break;
        case "numberOfActiveMembers":
          if (
            start.metrics.numberOfActiveMembers >
            end.metrics.numberOfActiveMembers
          ) {
            return -1;
          } else if (
            start.metrics.numberOfActiveMembers <
            end.metrics.numberOfActiveMembers
          ) {
            return 1;
          }
          return 0;
          break;
        default:
          // if (
          //   start.metrics.totalNumberOfRegisteredMembers >
          //   end.metrics.totalNumberOfRegisteredMembers
          // ) {
          //   return -1;
          // } else if (
          //   start.metrics.totalNumberOfRegisteredMembers <
          //   end.metrics.totalNumberOfRegisteredMembers
          // ) {
          //   return 1;
          // }
          // return 0;
          break;
      }
    };
    const sortedData = [...data].sort(compareFunc);
    setData(sortedData);
    console.log(sortedData);
  }, [reportFilter]);

  useEffect(() => {
    FetchReporting();

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }
  }, []);

  const FetchReporting = async () => {
    const response = await FetchReportsForCUAdmin();
    const reportingDataResp =
      response.data.responseBody.length > 0 ? response.data.responseBody : [];
    // const reportingDataResp = response.data.length > 0 ? response.data : [];
    // Reformat the reporting data
    let formattedData = [];
    reportingDataResp.forEach((report) => {
      const obj = {};
      obj.id = report.organizationId;
      obj.shortname = report.organizationName
        .split(" ")
        .map((split, index) => {
          if (index < 2) {
            return split[0];
          }
        })
        .join("");
      obj.name = report.organizationName;
      obj.type = report.organizationType.split("_").join(" ");
      obj.status = report.isOrganizationActive;
      obj.showAccordion = false;

      delete report.organizationId;
      delete report.organizationName;
      delete report.organizationType;
      delete report.isOrganizationActive;

      obj.metrics = report;
      formattedData.push(obj);
    });
    setData(formattedData);
    setReportFilter("totalNumberOfRegisteredMembers");
  };

  const showAccordionHandler = (id) => {
    const newData = data.map((dt) => {
      if (dt.id === id) {
        dt.showAccordion = !dt.showAccordion;
        return dt;
      } else return dt;
    });
    setData(newData);
  };

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
          <div className="flex items-center justify-between">
            <div className="pt-16 sm:pt-5 gap-4 flex flex-col">
              <h4 className="text-2xl font-semibold">Reporting</h4>
              <span className="text-md">
                Total credit union - {data.length}
              </span>
            </div>
            <div className="w-[250px]">
              <SelectInput
                name="reportFilter"
                value={reportFilter}
                className="w-full"
                label="Filter criteria"
                onChange={(e) => {
                  setReportFilter(e.target.value);
                }}
                options={filterOptions}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-5 px-3 h-[calc(100vh_-_160px)] border border-gray-200 overflow-y-scroll">
            {data.length === 0 && (
              <p className="my-5 text-gray-500">
                No reporting record available.
              </p>
            )}
            {data?.map(
              ({
                id,
                shortname,
                name,
                type,
                status,
                metrics,
                showAccordion,
              }) => (
                <div className="organization-group block mt-3">
                  <div
                    onClick={() => showAccordionHandler(id)}
                    className="brand cursor-pointer flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center font-semibold shadow border border-gray-50">
                      {shortname}
                      <span
                        className={`block absolute bottom-1 right-0 w-2 h-2 rounded full ${
                          status ? "bg-green-600" : "bg-red-600"
                        }`}
                      ></span>
                    </div>
                    <div className="">
                      <h4 className="text-sm font-light">{name}</h4>
                      <p className="text-xs text-gray-500 font-light">
                        {id} ({type})
                      </p>
                    </div>
                    <div
                      className={`caret transition-all duration-300 ml-auto ${
                        showAccordion ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9996 15.1999C11.8996 15.1999 11.7996 15.1791 11.6996 15.1374C11.5996 15.0957 11.4996 15.0332 11.3996 14.9499L6.47461 10.0249C6.30794 9.85824 6.22461 9.6499 6.22461 9.3999C6.22461 9.1499 6.30794 8.94157 6.47461 8.7749C6.64128 8.60824 6.84128 8.5249 7.07461 8.5249C7.30794 8.5249 7.50794 8.60824 7.67461 8.7749L11.9996 13.0999L16.3246 8.7749C16.4913 8.60824 16.6954 8.5249 16.9371 8.5249C17.1788 8.5249 17.3829 8.60824 17.5496 8.7749C17.7163 8.94157 17.7996 9.14574 17.7996 9.3874C17.7996 9.62907 17.7163 9.83324 17.5496 9.9999L12.5996 14.9499C12.4996 15.0332 12.4038 15.0957 12.3121 15.1374C12.2204 15.1791 12.1163 15.1999 11.9996 15.1999Z"
                          fill="#888888"
                        />
                      </svg>
                    </div>
                  </div>
                  <hr className="my-3" />
                  {showAccordion && (
                    <div className="bg-blue-50 p-3">
                      <div className="metrics-container w-full grid grid-cols-3 gap-3">
                        {Object.keys(metrics).map((keyName, id) => (
                          <div
                            className="w-full h-[120px] flex flex-col items-center bg-white justify-center shadow border border-gray-200 rounded"
                            key={id}
                          >
                            <p className="text-sm text-gray-400">{keyName}</p>{" "}
                            <p className="text-sm">{metrics[keyName]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Reporting;
