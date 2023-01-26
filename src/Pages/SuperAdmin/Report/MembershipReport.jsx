import RightSidebar from "../../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../../Layouts/Sidebar/Sidebar";
import { SVGS } from "../../../Assets";
import { DataTable } from "../../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Navbar from "../../../Layouts/Navbar/Navbar";
import { FetchAllBranchOfficerMembership } from "../../../Services/Reporting/ReportingService";
import { TextInput } from "../../../Components/Input/Input";
import SelectInput from "../../../Components/Select/Select";
import { GetWalletDetailsWithMobileNo } from "../../../Services/Finances/Finances";
import { useNavigate, useParams } from "react-router-dom";
import ExportToCSV from "../../../Components/ExportToCSV/ExportToCSV";

function MembershipReport() {
  const navigateTo = useNavigate();
  const user = useSelector((state) => state.userReducer);
  const [showWalletBalances, setShowWalletBalances] = useState(false);
  const [payload, setPayload] = useState({
    toDate: "",
    fromDate: "",
    memberStatus: "",
    memberId: "",
  });

  const [orgId, setOrgId] = useState(null);
  const params = useParams();

  const [organizationData, setOrganizationData] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [walletBalances, setWalletBalances] = useState(null);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  const hideWallet = (e) => {
    if (e.target.classList.contains("closer2")) {
      setShowWalletBalances(false);
    }
  };

  const fetchWalletBalances = async (mobileNum) => {
    const walletBalances = await GetWalletDetailsWithMobileNo(mobileNum);
    const mainWallet = walletBalances.data.responseBody.filter(
      (wallet) => wallet.walletType === "MAIN"
    )[0];
    const loyaltyWallet = walletBalances.data.responseBody.filter(
      (wallet) => wallet.walletType === "LOYALTY"
    )[0];
    const feeWallet = walletBalances.data.responseBody.filter(
      (wallet) => wallet.walletType === "FEE"
    )[0];
    const custodyWallet = walletBalances.data.responseBody.filter(
      (wallet) => wallet.walletType === "CUSTODY"
    )[0];
    const commissionWallet = walletBalances.data.responseBody.filter(
      (wallet) => wallet.walletType === "COMMISSION"
    )[0];

    setWalletBalances({
      main: mainWallet,
      loyalty: loyaltyWallet,
      fee: feeWallet,
      custody: custodyWallet,
      commission: commissionWallet,
    });
  };

  const [overviewCardLists, setOverviewCardLists] = useState([
    {
      text: "Total Members",
      value: rowData.length,
      icon: <SVGS.TransactionIcon />,
    },
  ]);
  useEffect(() => {
    const newDt = overviewCardLists.map((list) => {
      if (list.text === "Total Members") {
        return {
          text: "Total Members",
          value: rowData.length,
          icon: <SVGS.TransactionIcon />,
        };
      } else return list;
    });

    setOverviewCardLists(newDt);
  }, [rowData]);

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
      fromDate: "2022-01-01",
    });
  }, [payload]);

  const fetchMembership = async () => {
    const t = toast.loading("Fetching data");
    const pl = {
      organizationId: orgId,
      page: 1,
      size: 1000000,
    };
    
    if (payload.memberId) {
      pl.receiverIdentity = {
        identity: payload.memberId,
        identityType: "MSISDN",
      };
      pl.sendingIdentity = {
        identity: payload.memberId,
        identityType: "MSISDN",
      };
    }
    if (payload.fromDate) {
      if (payload.toDate) {
        pl.startDate = `${payload.fromDate}`;
      } else {
        toast.error("To date is required");
      }
    }
    if (payload.toDate) {
      if (payload.fromDate) {
        pl.endDate = `${payload.toDate}`;
      } else {
        toast.error("From date is required");
      }
    }
    if (payload.memberStatus) {
      pl.memberStatus = payload.memberStatus;
    }

    try {
      const trans = await FetchAllBranchOfficerMembership(pl);
      setRowData(trans.data.responseBody.contents);
      toast.remove(t);
      toast.success("Successfully fetched");
    } catch (error) {
      toast.remove(t);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setOrgId(params?.id);
    setOrgName(queryParams.get("orgName"));

    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }

    const orgData = {
      label: JSON.parse(sessionStorage.getItem("selectedScope"))
        .organizationName,
      value: orgId,
    };
    setOrganizationData(orgData);
  }, []);

  const filterChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const rows = rowData;

  const columns = [
    // {
    //   field: "id",
    //   headerName: "Transaction ID/REF",
    //   width: 350,
    //   renderCell: (props) => {
    //     return <p className="flex items-center relative">{props.row.id}</p>;
    //   },
    // },
    {
      field: "fullName",
      headerName: "Full name",
      width: 200,
      renderCell: (props) => {
        return (
          <p>
            {props.row.firstName} {props.row.lastName}
          </p>
        );
      },
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      width: 150,
      renderCell: (param) => {
        return (
          <p>{param.row.employeeNumber ? param.row.employeeNumber : "N/A"}</p>
        );
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 100,
      flex: 1,
      renderCell: (param) => {
        return <p>{param.row.gender ? param.row.gender : "N/A"}</p>;
      },
    },
    {
      field: "maritalStatus",
      headerName: "Marital Status",
      minWidth: 130,
      flex: 1,
      renderCell: (param) => {
        return (
          <p>{param.row.maritalStatus ? param.row.maritalStatus : "N/A"}</p>
        );
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 150,
      renderCell: (param) => {
        return <p>{param.row.mobileNumber ? param.row.mobileNumber : "N/A"}</p>;
      },
    },
    {
      field: "organizationShortName",
      headerName: "Organisation Name",
      minWidth: 150,
    },
    {
      field: "registrationDate",
      headerName: "Registration Date",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "accountHolderStatus",
      headerName: "Status",
      minWidth: 170,
      renderCell: (param) => {
        return (
          <>
            {param.value === "REGISTERED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-600 border border-gray-200"></span>
                <span className="text-xs text-gray-600">REGISTERED</span>
              </div>
            )}

            {param.value === "ACTIVE" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-600 border border-gray-200"></span>
                <span className="text-xs text-green-600">ACTIVE</span>
              </div>
            )}

            {param.value === "UNREGISTERED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 border border-gray-200"></span>
                <span className="text-xs text-red-600">UNREGISTERED</span>
              </div>
            )}

            {param.value === "CLOSED" && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-200"></span>
                <span className="text-xs text-yellow-600">CLOSED</span>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 265,
      renderCell: (param) => {
        const ShowWalletHandler = async (mobileNum) => {
          if (!mobileNum) {
            toast.error("User mobile number not found to fetch wallet.");
          } else {
            await fetchWalletBalances(mobileNum);
            setShowWalletBalances(true);
          }
        };
        const ShowDetailsHandler = (id) => {
          const data = rowData.filter((dt) => dt.id === id)[0];
          setSelectedData(data);
        };
        return (
          <div className="flex items-center gap-3">
            <span
              className="bg-primary-theme py-2 px-4 rounded text-white cursor-pointer"
              onClick={() => ShowWalletHandler(param.row.mobileNumber)}
            >
              View Wallet
            </span>
            <span
              className="bg-primary-theme py-2 px-4 rounded text-white cursor-pointer"
              onClick={() => ShowDetailsHandler(param.row.id)}
            >
              View Details
            </span>
          </div>
        );
      },
    },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Membership data is available",
  };

  const hideDetailsPage = (e) => {
    if (e.target.classList.contains("closer")) {
      setSelectedData(null);
    }
  };

  const goBackHandle = () => {
    navigateTo(-1);
  };

  return (
    <div className="flex relative">
      <Toaster position="top-center" />
      {selectedData && (
        <div
          onClick={hideDetailsPage}
          className="closer fixed w-full h-screen flex justify-center items-start top-0 left-0 bg-[#00000090] p-5 z-30"
        >
          <div className="w-[640px] min-h-64 rounded bg-white p-5">
            <h4 className="font-semibold">Membership Details page</h4>
            <hr />
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Member's ID</p>
              <h5 className="text-sm value">{selectedData?.id}</h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Member's Firstname</p>
              <h5 className="text-sm value">{selectedData?.firstName}</h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Member's Lastname</p>
              <h5 className="text-sm value">{selectedData?.lastName}</h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Member's Status</p>
              <h5 className="text-sm value">
                {selectedData?.memberStatus
                  ? selectedData?.memberStatus
                  : "N/A"}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Member's Gender</p>
              <h5 className="text-sm value">
                {selectedData?.gender ? selectedData?.gender : "N/A"}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Registration Date</p>
              <h5 className="text-sm value">
                {selectedData?.registrationDate}
              </h5>
            </div>
            <button
              onClick={hideDetailsPage}
              className="closer border border-primary-theme rounded px-3 py-2 text-primary-theme"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showWalletBalances && (
        <div
          onClick={hideWallet}
          className="closer2 fixed w-full h-screen flex justify-center items-start top-0 left-0 bg-[#00000090] p-5 z-30"
        >
          <div className="w-[640px] min-h-64 rounded bg-white p-5">
            Wallet balances
            <div className="grid grid-cols-2">
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances?.main?.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances?.main?.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">
                    {walletBalances?.main?.name}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances?.main?.walletType}
                  </h5>
                </div>
              </div>
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances?.loyalty?.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances?.loyalty?.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">
                    {walletBalances?.loyalty?.name}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances?.loyalty?.walletType}
                  </h5>
                </div>
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-2">
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances?.commission?.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances?.commission?.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">
                    {walletBalances?.commission?.name}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances?.commission?.walletType}
                  </h5>
                </div>
              </div>
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances?.fee?.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances?.fee?.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">{walletBalances?.fee?.name}</h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances?.fee?.walletType}
                  </h5>
                </div>
              </div>
              <button
                onClick={hideWallet}
                className="closer2 border border-primary-theme rounded px-3 py-2 text-primary-theme"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <BranchOfficerSidebar
        isLeftSidebarVisible={isLeftSidebarVisible}
        setIsLeftSidebarVisible={setIsLeftSidebarVisible}
      />
      <div className="w-full sm:w-[calc(100%_-_230px)] flex flex-col sm:flex-row items-start h-screen bg-white">
        <Navbar
          setIsLeftSidebarVisible={setIsLeftSidebarVisible}
          setIsRightSidebarVisible={setIsRightSidebarVisible}
        />
        <div className="middle-content mt-10 sm:mt-0 w-full sm:w-[calc(100%_-_240px)] p-6">
          <div className="pt-5">
            <h4 className="text-2xl font-semibold">
              <button
                onClick={goBackHandle}
                className="text-sm flex items-center"
              >
                <SVGS.BackIcon />
                Back
              </button>
              Branch Officer/Agent Reports
            </h4>
            <p className="text-sm">
              <span className="text-gray-400">Organization Name</span>:{orgName}
            </p>
            <p className="text-sm">
              <span className="text-gray-400">ID</span>:{orgId}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 mt-4 gap-4">
            {overviewCardLists.map(
              ({ text, value, icon, showDetails, hideDetails }, index) => (
                <div
                  onClick={showDetails}
                  className="w-full cursor-pointer transition-all duration-700 hover:border-gray-200 hover:shadow-lg h-auto bg-white hover:bg-gray-100 border border-gray-100 flex flex-col items-center justify-center gap-2 rounded-lg shadow p-4"
                >
                  {icon}
                  <h5 className="text-2xl font-semibold">{value}</h5>
                  <p className="text-sm text-center">{text}</p>
                </div>
              )
            )}
          </div>
          <div className="transactions py-4">
            <div className="w-full flex items-center gap-2">
              <div className="w-52">
                <TextInput
                  name="fromDate"
                  value={payload.fromDate}
                  type="date"
                  label="From Date"
                  className="w-full"
                  onChange={filterChangeHandler}
                />
              </div>
              <div className="w-52">
                <TextInput
                  name="toDate"
                  value={payload.toDate}
                  type="date"
                  label="To Date"
                  className="w-full"
                  onChange={filterChangeHandler}
                />
              </div>
              <div className="w-52">
                <SelectInput
                  className="w-full"
                  onChange={filterChangeHandler}
                  label="Member Status"
                  name="memberStatus"
                  value={payload.memberStatus}
                  options={[
                    { label: "ALL MEMBERS", value: "" },
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "REGISTERED", value: "REGISTERED" },
                    { label: "UN-REGISTERED", value: "UNREGISTERED" },
                  ]}
                />
              </div>
              <button
                onClick={fetchMembership}
                className="bg-primary-theme text-white p-4 rounded-md"
              >
                Search
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold uppercase">
                Membership Report
              </h4>
            </div>
            {tableProps.rows.length > 0 ? (
              <ExportToCSV csvData={JSON.stringify(tableProps?.rows)}>
                <div className="overflow-y-scroll_ h-[350px]">
                  <DataTable tableProps={tableProps} />
                </div>
              </ExportToCSV>
            ) : (
              <div className="overflow-y-scroll_ h-[350px]">
                <DataTable tableProps={tableProps} />
              </div>
            )}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default MembershipReport;
