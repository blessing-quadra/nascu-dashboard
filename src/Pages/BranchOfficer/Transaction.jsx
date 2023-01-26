import RightSidebar from "../../Layouts/RightSidebar/RightSidebar";
import React, { useState, useEffect } from "react";
import BranchOfficerSidebar from "../../Layouts/Sidebar/Sidebar";
import OverviewCard from "../../Components/Card/OverviewCard";
import { SVGS } from "../../Assets";
import { DataTable } from "../../Components/Table/Table";
import toast, { Toaster } from "react-hot-toast";
import { FetchTransactions } from "../../Services/Transactions/TransactionService";
import { RefreshToken } from "../../Services/Auth/Refresh";
import {Formatter} from "../../Utils/Formatter";
import Navbar from "../../Layouts/Navbar/Navbar";

function Transaction() {
  const [stats, setStats] = useState({
    transaction: 0,
    transactionCount: 0,
    cashout: 0,
    deposit: 0,
  });
  const [rowData, setRowData] = useState([]);

  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [viewTransactionDetails, setViewTransactionDetails] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(true);
      setIsRightSidebarVisible(true);
    } else if (window.innerWidth > 540) {
      setIsLeftSidebarVisible(false);
      setIsRightSidebarVisible(false);
    }
    const mobileNumber = JSON.parse(sessionStorage.getItem("mobileNumber"));
    const payload = {
      receiverIdentity: {
        identity: mobileNumber,
        identityType: "MSISDN",
      },
      sendingIdentity: {
        identity: mobileNumber,
        identityType: "MSISDN",
      },
      page: "1",
      size: "50",
    };

    const promise = FetchTransactions(payload);
    promise
      .then((response) => {
        const { responseDescription, responseBody } = response.data;

        if (responseBody.errorCode === "EXPIRED_ACCESS") {
          toast.error(responseDescription);
          RefreshToken();
        } else {
          toast.promise(promise, {
            loading: "Deposit processing...",
            success: responseDescription,
            error: "Failed",
          });
          const filteredDeposit = responseBody?.contents.filter(
            (content) => content.financialTransactionType !== "SETTLEMENT"
          );

          const rows = filteredDeposit.map(
            ({
              id,
              amount,
              financialTransactionType,
              financialTransactionStatus,
              creationDateTime,
              completionDateTime,
              receivingAccountHolder,
              receivingIdentity,
              financialTransactionReference
            }) => ({
              id: financialTransactionReference ? financialTransactionReference : id,
              amount: amount?.amount,
              beneficiary: `${receivingAccountHolder?.firstName} ${receivingAccountHolder?.lastName}`,
              mobileNumber: receivingIdentity?.identity,
              transactionType: financialTransactionType,
              transactionStatus: financialTransactionStatus,
              createdAt: creationDateTime,
              completionDate: completionDateTime,
            })
          );
          let _totalTransaction = 0;
          let _count = 0;
          let _deposit = 0;
          let _cashout = 0;
          rows.forEach((elem) => {
            _totalTransaction = _totalTransaction + elem.amount;
            _count = _count + 1;
            if (elem.transactionType === "DEPOSIT") {
              _deposit = _deposit + 1;
            } else if (elem.transactionType === "CASH_OUT") {
              _cashout = _cashout + 1;
            }
          });
          setStats({
            transaction: _totalTransaction,
            transactionCount: _count,
            deposit: _deposit,
            cashout: _cashout,
          });
          setRowData(rows);
        }
        // alert(JSON.stringify(rows));
      })
      .catch((error) => {
        const { status, responseBody } = error?.response?.data;

        if (status === 400) {
          toast.error("Bad request. Check and retry.");
        } else if (status === 404) {
          toast.error("Resources not available.");
        } else if (status === 500) {
          toast.error(responseBody.errorDescription);
        } else if (status === "EXPIRED_ACCESS") {
          toast.error(responseBody.errorDescription);
          RefreshToken();
        } else {
          toast.error(responseBody.errorDescription);
        }
      });
  }, []);

  const overviewCardLists = [
    {
      text: "Total number of transaction",
      value: stats.transactionCount,
      icon: <SVGS.TransactionIcon />,
    },
    {
      text: "Total Transaction in GMD",
      value: Formatter(stats.transaction),
      icon: <SVGS.CashoutIcon />,
    },
    {
      text: "Total number of deposit transaction",
      value: stats.deposit,
      icon: <SVGS.MembershipIcon />,
    },
    {
      text: "Total number of cashout transaction",
      value: stats.cashout,
      icon: <SVGS.CashoutIcon />,
    },
  ];

  const rows = rowData;

  const columns = [
    {
      field: "id",
      headerName: "Transaction ID/REF",
      width: 205,
      renderCell: (props) => {
        const CopyOrgIDHandler = (id) => {
          window.navigator.clipboard.writeText(id);
          toast.success("Copied Successfully");
        };
        return (
          <p className="flex items-center relative">
            {props.value}{" "}
            <span
              onClick={() => CopyOrgIDHandler(props.value)}
              title="Copy Transaction ID"
              className="flex w-5 absolute bg-white cursor-pointer left-44"
            >
              <SVGS.CopyIcon />
            </span>
          </p>
        );
      },
    },
    {
      field: "beneficiary",
      headerName: "Beneficiary",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.row.beneficiary}</p>
        );
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.row.mobileNumber}</p>
        );
      },
    },
    {
      field: "amount",
      headerName: "Amount (GMD)",
      minWidth: 180,
      flex: 1,
      renderCell: (param) => {
        return (
          <p className="text-center flex justify-center pl-4">{param.value}</p>
        );
      },
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Creation Period",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "completionDate",
      headerName: "Completion Period",
      minWidth: 180,
      flex: 1,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   width: 150,
    //   renderCell: (props) => {
    //     const CopyOrgIDHandler = (id) => {
    //       window.navigator.clipboard.writeText(id);
    //       toast.success("Copied Successfully");
    //     };
    //     return (
    //       <span
    //         className="bg-primary-theme py-2 px-4 rounded text-white cursor-pointer"
    //         onClick={() => setViewTransactionDetails(true)}
    //       >
    //         View Details
    //       </span>
    //     );
    //   },
    // },
  ];
  const tableProps = {
    columns,
    rows,
    icon: "",
    emptyDataText: "No Transaction data is available",
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
          <div className="pt-16 sm:pt-5">
            <h4 className="text-2xl font-semibold">Transaction</h4>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
            {overviewCardLists.map(({ text, value, icon }, index) => (
              <OverviewCard key={index} text={text} value={value} icon={icon} />
            ))}
          </div>
          <div className="transactions py-4">
            {viewTransactionDetails && (
              <div className="w-full">
                back
              </div>
            )}

            {!viewTransactionDetails && (
              <>
                <div className="flex justify-between items-center my-4">
                  <h4 className="text-lg font-semibold">Transaction</h4>
                </div>
                <div className="overflow-y-scroll_ h-[350px]">
                  <DataTable tableProps={tableProps} />
                </div>
              </>
            )}

            {/* {membershipList.map(({ name, role }, index) => (
              <UserCard name={name} role={role} key={index} />
            ))} */}
          </div>
        </div>
        <RightSidebar isRightSidebarVisible={isRightSidebarVisible} />
      </div>
    </div>
  );
}

export default Transaction;
