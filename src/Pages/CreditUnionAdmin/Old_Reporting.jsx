import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../Layouts/Navbar/Navbar";
import {
  FetchOrganisationRoles,
} from "../../Services/Role/Role";
import {
  FetchReportForBO,
} from "../../Services/Reporting/Reporting";


function Reporting() {
  const [showOverlay, setShowOverlay] = useState(false);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    )?.organizationId;
    FetchReporting(organizationId);

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    const fetchRolesPromise = FetchOrganisationRoles(organizationId);
    fetchRolesPromise.then((response) => {
      const { contents } = response.data.responseBody;
      setRolesData(contents);
    });
  }, []);

  const FetchReporting = async (organizationId) => {
    const response = await FetchReportForBO(organizationId);
    // const reportingDataResp = response.responseBody.contents
    //   ? [response.responseBody.contents]
    //   : [];
    const reportingDataResp = [response.data.responseBody].length > 0 ? [response.data.responseBody] : [];
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

      delete report.organizationId;
      delete report.organizationName;
      delete report.organizationType;
      delete report.isOrganizationActive;

      obj.metrics = report;
      formattedData.push(obj);
    });
    setData(formattedData);
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
          <div className="pt-16 sm:pt-5 flex items-center gap-4">
            <h4 className="text-2xl font-semibold">Reporting</h4>
          </div>

          {/* <div className="transactions py-4">
            <LineGraph data={graphData}/>
            <BarGraph data={graphData}/>
          </div> */}

          {/* <div className="w-full h-[calc(100vh_-_125px)] mt-5 pr-5 overflow-y-scroll">
            {reportingData.map((element, index) => (
              <SwiperContainer data={reportingData[index]} />
            ))}
          </div> */}

          <div className="w-full flex flex-col gap-3 mt-5 px-3 h-[calc(100vh_-_120px)] border border-gray-200 overflow-y-scroll">
            {data.length === 0 && (
              <p className="my-5 text-gray-500">
                No reporting record available.
              </p>
            )}
            {data?.map(({ id, shortname, name, type, status, metrics }) => (
              <div className="organization-group block mt-3">
                <div className="brand flex items-center gap-3">
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
                </div>
                <hr className="my-3" />
                <div className="">
                  <div className="metrics-container w-full grid grid-cols-3 gap-3">
                    {Object.keys(metrics).map((keyName, id) => (
                      <div
                        className="w-full h-[120px] flex flex-col items-center justify-center shadow border border-gray-200 rounded"
                        key={id}
                      >
                        <p className="text-sm text-gray-400">{keyName}</p>{" "}
                        <p className="text-sm">{metrics[keyName]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Reporting;
