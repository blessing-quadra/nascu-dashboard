import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReportCard from "../../Components/Card/ReportCard";
import ExportToCSV from "../../Components/ExportToCSV/ExportToCSV";
import { TextInput } from "../../Components/Input/Input";
import SelectInput from "../../Components/Select/Select";
import Navbar from "../../Layouts/Navbar/Navbar";
import CreditUnionReportFilterOverlay from "../../Layouts/Overlay/CreditUnionReportFilterOverlay";
import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import CreditUnionReportTable from "../../Layouts/Table/SuperAdmin/CreditUnionReportTable";
import {
  FetchReportForBO,
  FetchReportForCU,
  FetchTotalRegisteredCreditUnion,
  FetchTotalActiveCreditUnion,
} from "../../Services/Reporting/Reporting";

function Reporting() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
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
        : "0" + (today.getMonth() + 1);
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
    FetchNASCUReporting();
  }, []);

  const FetchNASCUReporting = async () => {
    const now = Date.now();
    const ninetyDaysAgo = 90 * 24 * 60 * 60 * 1000;
    let today = new Date(now).toLocaleString().split(",")[0];
    const t1 = today.split("/");
    const m1 = t1[0].length > 1 ? t1[0] : "0" + t1[0];
    const d1 = t1[1].length > 1 ? t1[1] : "0" + t1[1];
    const y1 = t1[2];
    today = `${y1}-${m1}-${d1}`;
    let lastThreeMonth = new Date(now - ninetyDaysAgo)
      .toLocaleString()
      .split(",")[0];
    const t2 = lastThreeMonth.split("/");
    const m2 = t2[0].length > 1 ? t2[0] : "0" + t2[0];
    const d2 = t2[1].length > 1 ? t2[1] : "0" + t2[1];
    const y2 = t2[2];
    lastThreeMonth = `${y2}-${m2}-${d2}`;
    const totalCreditUnion = await FetchTotalRegisteredCreditUnion();
    // const totalActiveCreditUnion = await FetchTotalActiveCreditUnion({
    //   toDate: today,
    //   fromDate: lastThreeMonth,
    // });
    // const creditUnionWithTransaction = totalActiveCreditUnion.data.responseBody;
    const activeCreditUnionLength = totalCreditUnion.data.responseBody.filter(
      (user) => user.creditUnionTransactionStatus === "ACTIVE"
    ).length;
    const newData = {
      metrics: {
        registered_credit_union: totalCreditUnion.data.responseBody.length,
        // active_credit_union: activeCreditUnionLength,
      },
    };
    const reportingDataResp = newData;
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

  const FetchNASCUUsersReporting = async (e) => {
    e.preventDefault();
    if (payload.fromDate && payload.toDate && payload.type) {
      setIsLoading(true);
      let response;
      let newData = {
        users: [],
      };

      if (payload.type === "active_credit_union") {
        response = await FetchTotalActiveCreditUnion(payload);
        response.data.responseBody.forEach(
          ({
            organizationId,
            organizationName,
            totalTransactionVolume,
            creditUnionTransactionStatus,
            joiningDate,
          }) => {
            const newObj = {
              id: organizationId, //transactionId
              organizationName: organizationName,
              organizationType: "CREDIT_UNION",
              transaction_volume: totalTransactionVolume,
              date: joiningDate,
              status: creditUnionTransactionStatus,
            };
            newData.users.push(newObj);
          }
        );
      } else {
        response = await FetchTotalRegisteredCreditUnion(payload);
        response.data.responseBody.forEach(
          ({
            organizationId,
            organizationName,
            totalTransactionVolume,
            totalTransactionAmount,
            joiningDate,
            creditUnionTransactionStatus,
          }) => {
            const newObj = {
              id: organizationId, //transactionId
              organizationName: organizationName,
              organizationType: "CREDIT_UNION",
              transaction_volume: totalTransactionVolume,
              transaction_amount: totalTransactionAmount,
              date: joiningDate,
              status: creditUnionTransactionStatus,
            };
            newData.users.push(newObj);
          }
        );
      }

      setSelectedCard(payload.type);
      setData(newData.users);
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
  return (
    <div className="flex relative">
      {showOverlay && (
        <CreditUnionReportFilterOverlay
          setShowOverlay={setShowOverlay}
          payload={payload}
          changeFilterProps={changeFilterProps}
          generateReport={FetchNASCUUsersReporting}
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
              <h4 className="text-2xl font-semibold">NASCU Reporting</h4>
              <p className="text-sm">
                Click on the (Registered Credit Union) card below to view more
                infomation about the credit unions.
              </p>
              <hr className="w-full mt-4" />
            </div>
            <div className="tab-header pt-4 flex items-center justify-between gap-2"></div>
            <div className="w-full h-32 grid grid-cols-5 gap-4 my-4">
              {metrics.map(({ label, value }) => (
                <ReportCard
                  isActive={selectedCard === label.split(" ").join("_")}
                  viewMoreHandler={viewMoreHandler}
                  name={label}
                  value={value}
                  isDetailsAvailable={true}
                />
              ))}
            </div>
            <div className="w-full">
              {isLoading && !data ? (
                <div className="preload flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-gray-600 border-t-transparent animate-spin"></div>
                  <p className="text-sm text-gray-600">
                    Fetching {payload.type} from {payload.fromDate} to{" "}
                    {payload.toDate}
                  </p>
                </div>
              ) : (
                <ExportToCSV csvData={data ? data : ""}>
                  <CreditUnionReportTable data={data} />
                </ExportToCSV>
              )}
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Reporting;
