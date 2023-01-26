import RightSidebar from "../../../Layouts/RightSidebar/RightSidebar";
import React, { useEffect, useState } from "react";
import BranchOfficerSidebar from "../../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../../Components/Card/OverviewCard";
import { SVGS } from "../../../Assets";
import { DataTable } from "../../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import RegisterUserOverlay from "../../../Layouts/Overlay/RegisterUserOverlay";
import { useSelector } from "react-redux";
import { ViewAllMember } from "../../../Services/User/User";
import MembershipInfoOverlay from "../../../Layouts/Overlay/MembershipInfoOverlay";
import Navbar from "../../../Layouts/Navbar/Navbar";
import { FetchAllBranchOfficerTransactions } from "../../../Services/Reporting/ReportingService";
import { TextInput } from "../../../Components/Input/Input";
import SelectInput from "../../../Components/Select/Select";
import { WalletBalances } from "../../../Services/Reporting/Reporting";
import { GetWalletDetails } from "../../../Services/Finances/Finances";

function SalaryReport() {
  const user = useSelector((state) => state.userReducer);
  const [showWalletBalances, setShowWalletBalances] = useState(false);
  const [payload, setPayload] = useState({
    toDate: "",
    fromDate: "",
    transactionType: "",
    memberId: "",
  });

  const [organizationData, setOrganizationData] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [walletBalances, setWalletBalances] = useState(null);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  const showWallet = () => {
    setShowWalletBalances(true);
  };
  const hideWallet = (e) => {
    if (e.target.classList.contains("closer2")) {
      setShowWalletBalances(false);
    }
  };
  useEffect(() => {
    fetchWalletBalances();
  }, []);

  const fetchWalletBalances = async () => {
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    ).id;
    const walletBalances = await GetWalletDetails(organizationId);
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
      text: "Total transactions",
      value: rowData.length,
      icon: <SVGS.TransactionIcon />,
    },
    {
      text: "Wallet",
      value: "-",
      icon: <SVGS.DepositIcon />,
      showDetails: showWallet,
      hideDetails: hideWallet,
    },
  ]);
  useEffect(() => {
    const newDt = overviewCardLists.map((list) => {
      if (list.text === "Total transactions") {
        return {
          text: "Total transactions",
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
        : "0" + today.getMonth() + 1;
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

  const fetchTransactions = async () => {
    const t = toast.loading("Fetching data");
    const pl = {
      page: 1,
      size: 100000,
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
        pl.startDate = `${payload.fromDate}T12:00:00.485Z`;
      } else {
        toast.error("To date is required");
      }
    }
    if (payload.toDate) {
      if (payload.fromDate) {
        pl.endDate = `${payload.toDate}T12:00:00.485Z`;
      } else {
        toast.error("From date is required");
      }
    }
    if (payload.transactionType) {
      pl.financialTransactionType = payload.transactionType;
    }
    // if (payload.transactionType === "") {
    //   delete pl.startDate;
    //   delete pl.endDate;
    // }

    try {
      const trans = await FetchAllBranchOfficerTransactions(pl);
      setRowData(trans.data.responseBody.contents);
      toast.remove(t);
      toast.success("Successfully fetched");
      //   alert(JSON.stringify(trans.data.responseBody.contents));
    } catch (error) {
      toast.remove(t);
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }
    const organizationId = JSON.parse(
      sessionStorage.getItem("selectedScope")
    ).organizationId;
    const promise2 = ViewAllMember(organizationId);

    const orgData = {
      label: JSON.parse(sessionStorage.getItem("selectedScope"))
        .organizationName,
      value: JSON.parse(sessionStorage.getItem("selectedScope")).organizationId,
    };
    setOrganizationData(orgData);

    promise2.then((response) => {
      const { contents } = response.data.responseBody;
      setMembersData(contents);
    });
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
    {
      field: "id",
      headerName: "Transaction ID/REF",
      width: 350,
      renderCell: (props) => {
        const CopyOrgIDHandler = (id) => {
          window.navigator.clipboard.writeText(id);
          toast.success("Copied Successfully");
        };
        return (
          <p className="flex items-center relative">
            {props.row.financialTransactionReference
              ? props.row.financialTransactionReference
              : props.row.id}
          </p>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount (GMD)",
      minWidth: 150,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">
            {param.row?.amount?.amount ? param.row?.amount?.amount : "N/A"}
          </p>
        );
      },
    },
    {
      field: "sender",
      headerName: "Sender",
      minWidth: 250,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center">
            {param.row?.sendingIdentity?.identity
              ? param.row?.sendingIdentity?.identity
              : "N/A"}
          </p>
        );
      },
    },
    {
      field: "financialTransactionStatus",
      headerName: "Transaction Status",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center">
            {param.row.financialTransactionStatus}
          </p>
        );
      },
    },
    {
      field: "financialTransactionType",
      headerName: "Transaction Type",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">
            {param.row.financialTransactionType}
          </p>
        );
      },
    },
    {
      field: "completionDateTime",
      headerName: "Completion DateTime",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (param) => {
        const ShowDetailsHandler = (id) => {
          const data = rowData.filter((dt) => dt.id === id)[0];
          setSelectedData(data);
        };
        return (
          <span
            className="bg-primary-theme py-2 px-4 rounded text-white cursor-pointer"
            onClick={() => ShowDetailsHandler(param.row.id)}
          >
            View Details
          </span>
        );
      },
    },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Transaction data is available",
  };

  const hideDetailsPage = (e) => {
    if (e.target.classList.contains("closer")) {
      setSelectedData(null);
    }
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
            <h4 className="font-semibold">Transaction Details page</h4>
            <hr />
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Transaction ID/REF</p>
              <h5 className="text-sm value">
                {selectedData?.financialTransactionReference
                  ? selectedData?.financialTransactionReference
                  : selectedData?.id}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Transaction Amount</p>
              <h5 className="text-sm value">
                ${selectedData?.amount?.amount.toLocaleString()}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Transaction Status</p>
              <h5 className="text-sm value">
                {selectedData?.financialTransactionStatus}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Transaction Type</p>
              <h5 className="text-sm value">
                {selectedData?.financialTransactionType}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Sender's Details</p>
              <h5 className="text-sm value">
                {selectedData?.sendingAccountHolder?.firstName}{" "}
                {selectedData?.sendingAccountHolder?.lastName}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">Sender Identity</p>
              <h5 className="text-sm value">
                {selectedData?.sendingIdentity?.identity}
              </h5>
            </div>
            <div className="details my-5">
              <p className="title text-xs text-gray-400">
                Transaction Completion Date
              </p>
              <h5 className="text-sm value">
                {selectedData?.completionDateTime}
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
                    {walletBalances.main.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances.main.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">{walletBalances.main.name}</h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances.main.walletType}
                  </h5>
                </div>
              </div>
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances.loyalty.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances.loyalty.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">
                    {walletBalances.loyalty.name}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances.loyalty.walletType}
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
                    {walletBalances.commission.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances.commission.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">
                    {walletBalances.commission.name}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances.commission.walletType}
                  </h5>
                </div>
              </div>
              <div>
                <div className="details mt-5">
                  <p className="title text-xs text-gray-400">Account Number</p>
                  <h5 className="text-sm value">
                    {walletBalances.fee.accountNumber}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">
                    Available Balance
                  </p>
                  <h5 className="text-sm value">
                    {walletBalances.fee.availableBalance}
                  </h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet name</p>
                  <h5 className="text-sm value">{walletBalances.fee.name}</h5>
                </div>
                <div className="details my-2">
                  <p className="title text-xs text-gray-400">Wallet Type</p>
                  <h5 className="text-sm value">
                    {walletBalances.fee.walletType}
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
              Branch Officer/Agent Reports
            </h4>
            <p className="text-sm"><span className="text-gray-400">ID</span>: {organizationData.value}</p>
            <p className="text-sm"><span className="text-gray-400">Credit Union</span>: {organizationData.label}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 mt-4 gap-4">
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
                  label="Member's ID"
                  name="memberId"
                  value={payload.memberId}
                  className="w-full"
                  onChange={filterChangeHandler}
                />
              </div>
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
                  label="Transaction Type"
                  name="transactionType"
                  value={payload.transactionType}
                  options={[
                    { label: "ALL TRANSACTIONS", value: "" },
                    { label: "ADJUSTMENT", value: "ADJUSTMENT" },
                    { label: "DEPOSIT", value: "DEPOSIT" },
                    { label: "TRANSFER", value: "TRANSFER" },
                    { label: "FEE", value: "FEE" },
                    { label: "CASH_OUT", value: "CASH_OUT" },
                    { label: "PAYMENT", value: "PAYMENT" },
                    { label: "BANK_TRANSFER", value: "BANK_TRANSFER" },
                    { label: "SETTLEMENT", value: "SETTLEMENT" },
                    { label: "FLOAT_TRANSFER", value: "FLOAT_TRANSFER" },
                    { label: "SALARY", value: "SALARY" },
                    {
                      label: "COMMISSION_PAYMENT",
                      value: "COMMISSION_PAYMENT",
                    },
                  ]}
                />
              </div>
              <button
                onClick={fetchTransactions}
                className="bg-primary-theme text-white p-4 rounded-md"
              >
                Search
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4">
              <h4 className="text-lg font-semibold uppercase">Report</h4>
            </div>
            <div className="overflow-y-scroll_ h-[350px]">
              <DataTable tableProps={tableProps} />
            </div>
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default SalaryReport;
